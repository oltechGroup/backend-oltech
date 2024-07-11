import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { v4 as uuid } from 'uuid';
import { Prisma } from '@prisma/client';
import { CreateComponenteUsedDto } from './dto/create-componente-used.dto';
import { CreateComponenteDto } from './dto/create-componente.dto';
import { UpdateComponenteDto } from './dto/update-componente.dto';
import { UpdateComponenteUsedDto } from './dto/update-componente-used.dto';
import { CreateRemissionDto } from './dto/create-remission.dto';

enum TipoMovimiento {
  ENTRADA = 'entrada',
  SALIDA = 'salida',
  REMISSION = 'remision',
}

@Injectable()
export class ComponentesService {
  constructor(private prisma: PrismaService) {}

  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.componentesWhereUniqueInput;
    search?: string;
    orderBy?: Prisma.componentesOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, orderBy } = params;
    return this.prisma.componentes.findMany({
      skip,
      take,
      cursor,
      where: {
        OR: [
          {
            measures: {
              contains: params.search,
            },
          },
          {
            componentes_categories: {
              name: {
                contains: params.search,
              },
            },
          },
        ],
        stock: {
          gt: 0,
        },
      },
      orderBy,
      select: {
        id: true,
        measures: true,
        registration_date: true,
        stock: true,
        lote: true,
        caducidad: true,
        componentes_categories: true,
        remission_stock: true,
        users: {
          select: {
            id: true,
            name: true,
            lastname: true,
          },
        },
      },
    });
  }

  async findAllBySubcategory(
    params: {
      skip?: number;
      take?: number;
      sort?: string;
      order?: string;
    },
    subcategory: string,
  ) {
    const { sort, order } = params;

    const validSortColumns = ['measures', 'registration_date'];
    const validOrders = ['ASC', 'DESC'];

    // Asegúrate de que `sort` sea una columna válida
    const sortColumn = validSortColumns.includes(sort)
      ? sort
      : 'registration_date';
    const orderDirection = validOrders.includes(order.toUpperCase())
      ? order.toUpperCase()
      : 'DESC';

      console.log(sortColumn, orderDirection);
      
    const componentes: any = await this.prisma.$queryRaw`
      SELECT componentes.*, componentes_categories.name AS categoria
      FROM componentes
      JOIN componentes_categories ON componentes.category = componentes_categories.id
      WHERE componentes_categories.name = ${subcategory}
      ORDER BY componentes.${Prisma.sql([sortColumn])} ${Prisma.sql([orderDirection])};`;

    return componentes;
  }

  findAllUsed(params: {
    skip?: number;
    take?: number;
    search?: string;
    where?: Prisma.componentesWhereInput;
    orderBy?: Prisma.componentesOrderByWithRelationInput;
  }) {
    const { skip, take, orderBy } = params;
    return this.prisma.componentes_used.findMany({
      skip,
      take,
      orderBy,
      where: {
        componentes: {
          OR: [
            {
              measures: {
                contains: params.search,
              },
            },
            {
              componentes_categories: {
                name: {
                  contains: params.search,
                },
              },
            },
          ],
        },
      },
      select: {
        id: true,
        quantity: true,
        registration_date: true,
        patient: true,
        hospitals: true,
        used_date: true,
        componentes: {
          select: {
            id: true,
            measures: true,
            registration_date: true,
            stock: true,
            lote: true,
            caducidad: true,
            componentes_categories: true,
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            lastname: true,
          },
        },
      },
    });
  }

  findAllInventory(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.componentes_inventoryWhereUniqueInput;
    search?: string;
    orderBy?: Prisma.componentes_inventoryOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, orderBy } = params;
    return this.prisma.componentes_inventory.findMany({
      skip,
      take,
      cursor,
      where: {
        componentes: {
          OR: [
            {
              measures: {
                contains: params.search,
              },
            },
            {
              componentes_categories: {
                name: {
                  contains: params.search,
                },
              },
            },
          ],
        },
      },
      orderBy,
      select: {
        id: true,
        fecha_movimiento: true,
        quantity: true,
        tipo_movimiento: true,
        componentes: {
          select: {
            id: true,
            measures: true,
            registration_date: true,
            stock: true,
            lote: true,
            caducidad: true,
            componentes_categories: true,
          },
        },
      },
    });
  }

  countUsed({ search }): Promise<number> {
    return this.prisma.componentes_used.count({
      where: {
        componentes: {
          OR: [
            {
              measures: {
                contains: search,
              },
            },
            {
              componentes_categories: {
                name: {
                  contains: search,
                },
              },
            },
          ],
        },
      },
    });
  }
  countAll({ search }): Promise<number> {
    return this.prisma.componentes.count({
      where: {
        OR: [
          {
            measures: {
              contains: search,
            },
          },
          {
            componentes_categories: {
              name: {
                contains: search,
              },
            },
          },
        ],
        stock: {
          gt: 0,
        },
      },
    });
  }
  countInventory({ search }): Promise<number> {
    return this.prisma.componentes_inventory.count({
      where: {
        componentes: {
          OR: [
            {
              measures: {
                contains: search,
              },
            },
            {
              componentes_categories: {
                name: {
                  contains: search,
                },
              },
            },
          ],
        },
      },
    });
  }

  async addUsed(componenteUsed: CreateComponenteUsedDto, user_id: string) {
    await this.prisma.componentes_inventory.create({
      data: {
        id: uuid(),
        quantity: componenteUsed.quantity,
        tipo_movimiento: TipoMovimiento.SALIDA,
        componentes: {
          connect: {
            id: componenteUsed.componente_id,
          },
        },
      },
    });

    const stockComponente = await this.prisma.componentes.findUnique({
      where: {
        id: componenteUsed.componente_id,
      },
      select: {
        stock: true,
      },
    });

    const newStock = stockComponente.stock - componenteUsed.quantity;

    await this.prisma.componentes.update({
      where: {
        id: componenteUsed.componente_id,
      },
      data: {
        stock: newStock,
      },
    });

    return this.prisma.componentes_used.create({
      data: {
        id: uuid(),
        quantity: componenteUsed.quantity,
        patient: componenteUsed.patient,
        used_date: `${componenteUsed.used_date}T12:00:00Z`,
        hospitals: {
          connect: {
            id: componenteUsed.hospital_id,
          },
        },
        componentes: {
          connect: {
            id: componenteUsed.componente_id,
          },
        },
        users: {
          connect: {
            id: user_id,
          },
        },
      },
    });
  }

  create(componente: CreateComponenteDto, user_id: string) {
    return this.prisma.componentes_inventory.create({
      data: {
        id: uuid(),
        quantity: componente.stock,
        tipo_movimiento: TipoMovimiento.ENTRADA,
        componentes: {
          create: {
            id: uuid(),
            measures: componente.measures,
            lote: componente.lote,
            caducidad: `${componente.caducidad}T12:00:00Z`,
            stock: componente.stock,
            componentes_categories: {
              connect: {
                id: componente.category,
              },
            },
            users: {
              connect: {
                id: user_id,
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, newDataComponente: UpdateComponenteDto) {
    const componenteToUpdate = await this.prisma.componentes.findUnique({
      where: {
        id,
      },
    });

    const tipoMovimiento =
      componenteToUpdate.stock > newDataComponente.stock
        ? TipoMovimiento.SALIDA
        : TipoMovimiento.ENTRADA;
    const quantity = Math.abs(
      componenteToUpdate.stock - newDataComponente.stock,
    );

    await this.prisma.componentes_inventory.create({
      data: {
        id: uuid(),
        quantity,
        tipo_movimiento: tipoMovimiento,
        componentes: {
          connect: {
            id,
          },
        },
      },
    });

    return this.prisma.componentes.update({
      where: {
        id,
      },
      data: {
        caducidad:
          newDataComponente.caducidad.length > 10
            ? componenteToUpdate.caducidad
            : `${newDataComponente.caducidad}T12:00:00Z`,
        lote: newDataComponente.lote,
        category: newDataComponente.category,
        measures: newDataComponente.measures,
        stock: newDataComponente.stock,
      },
    });
  }

  async updateUsed(id: string, newDataComponenteUsed: UpdateComponenteUsedDto) {
    const componenteUsedToUpdate =
      await this.prisma.componentes_used.findUnique({
        where: {
          id,
        },
      });

    if (componenteUsedToUpdate.quantity !== newDataComponenteUsed.quantity) {
      const quantity = Math.abs(
        componenteUsedToUpdate.quantity - newDataComponenteUsed.quantity,
      );

      const tipoMovimiento =
        componenteUsedToUpdate.quantity > newDataComponenteUsed.quantity
          ? TipoMovimiento.ENTRADA
          : TipoMovimiento.SALIDA;

      await this.prisma.componentes_inventory.create({
        data: {
          id: uuid(),
          quantity,
          tipo_movimiento: tipoMovimiento,
          componentes: {
            connect: {
              id: componenteUsedToUpdate.componente_id,
            },
          },
        },
      });

      const stockComponente = await this.prisma.componentes.findUnique({
        where: {
          id: componenteUsedToUpdate.componente_id,
        },
        select: {
          stock: true,
        },
      });

      const newStock =
        tipoMovimiento === TipoMovimiento.SALIDA
          ? stockComponente.stock - quantity
          : stockComponente.stock + quantity;

      await this.prisma.componentes.update({
        where: {
          id: componenteUsedToUpdate.componente_id,
        },
        data: {
          stock: newStock,
        },
      });
    }

    return this.prisma.componentes_used.update({
      where: {
        id,
      },
      data: {
        hospital_id: newDataComponenteUsed.hospital_id,
        patient: newDataComponenteUsed.patient,
        quantity:
          newDataComponenteUsed.quantity || componenteUsedToUpdate.quantity,
        used_date: `${newDataComponenteUsed.used_date}T12:00:00Z`,
      },
    });
  }

  remove(id: string) {
    return this.prisma.componentes.delete({
      where: {
        id,
      },
    });
  }

  async removeUsed(id: string) {
    const componenteUsed = await this.prisma.componentes_used.findUnique({
      where: {
        id,
      },
      select: {
        quantity: true,
        componentes: {
          select: {
            id: true,
          },
        },
      },
    });

    const componente = await this.prisma.componentes.findUnique({
      where: {
        id: componenteUsed.componentes.id,
      },
      select: {
        stock: true,
      },
    });

    const newStock = componente.stock + componenteUsed.quantity;

    await this.prisma.componentes_inventory.create({
      data: {
        id: uuid(),
        quantity: componenteUsed.quantity,
        tipo_movimiento: TipoMovimiento.ENTRADA,
        componentes: {
          connect: {
            id: componenteUsed.componentes.id,
          },
        },
      },
    });

    await this.prisma.componentes.update({
      where: {
        id: componenteUsed.componentes.id,
      },
      data: {
        stock: newStock,
      },
    });

    return this.prisma.componentes_used.delete({
      where: {
        id,
      },
    });
  }

  async getStadistics() {
    const countComponentes = await this.prisma.componentes.aggregate({
      _sum: {
        stock: true,
      },
    });
    const countComponentesByCategory = await this.prisma.componentes.groupBy({
      by: ['category'],
      _count: {
        stock: true,
      },
      _sum: {
        stock: true,
      },
    });

    const arrayCountByCategory = [];

    for (let category of countComponentesByCategory) {
      const categoryName = await this.prisma.componentes_categories.findUnique({
        where: {
          id: category.category,
        },
        select: {
          name: true,
        },
      });

      arrayCountByCategory.push({
        category: categoryName.name,
        count: category._count.stock,
        sum: category._sum.stock,
      });
    }

    const stadisticsInventory =
      await this.prisma.componentes_inventory.findMany({
        select: {
          quantity: true,
          tipo_movimiento: true,
        },
        orderBy: {
          fecha_movimiento: 'desc',
        },
        take: 30,
      });

    return {
      countComponentes,
      arrayCountByCategory,
      stadisticsInventory,
    };
  }

  async searchComponente(search: string) {
    return this.prisma.componentes.findMany({
      where: {
        OR: [
          {
            measures: {
              contains: search,
            },
          },
          {
            componentes_categories: {
              name: {
                contains: search,
              },
            },
          },
        ],
        stock: {
          gt: 0,
        },
      },
      select: {
        id: true,
        measures: true,
        registration_date: true,
        stock: true,
        lote: true,
        caducidad: true,
        componentes_categories: true,
        users: {
          select: {
            id: true,
            name: true,
            lastname: true,
          },
        },
      },
    });
  }

  async getCategories() {
    return this.prisma.componentes_categories.findMany();
  }

  async updateStock(id: string, newStock: number, oldStock: number) {
    const quantity = Math.abs(newStock - oldStock);
    const tipoMovimiento =
      newStock < oldStock ? TipoMovimiento.SALIDA : TipoMovimiento.ENTRADA;

    await this.prisma.componentes_inventory.create({
      data: {
        id: uuid(),
        quantity,
        tipo_movimiento: tipoMovimiento,
        componentes: {
          connect: {
            id,
          },
        },
      },
    });

    return this.prisma.componentes.update({
      where: {
        id,
      },
      data: {
        stock: newStock,
      },
    });
  }

  // Remissions
  async findAllRemissions(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.componentesWhereUniqueInput;
    search?: string;
    orderBy?: Prisma.componentesOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, orderBy } = params;

    return this.prisma.componentes_remisiones.findMany({
      skip,
      take,
      where: {
        OR: [
          {
            name: {
              contains: params.search,
            },
          },
          {
            users: {
              name: {
                contains: params.search,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        date_remission: true,
        codigo: true,
        status: true,
        users: {
          select: {
            id: true,
            name: true,
            lastname: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            componentes_has_componentes_remisiones: true,
          },
        },
      },
      orderBy,
    });
  }

  async countRemissions({ search }): Promise<number> {
    return this.prisma.componentes_remisiones.count({
      where: {
        OR: [
          {
            name: {
              contains: search,
            },
          },
          {
            users: {
              name: {
                contains: search,
              },
            },
          },
        ],
      },
    });
  }

  async createRemission(remission: CreateRemissionDto, user_id_req: string) {
    const idRemission = uuid();
    const dateNow = new Date();
    const dateRemission = `${remission.date_remission}T12:00:00Z`;
    const countRemissions = await this.prisma.componentes_remisiones.count();
    const codigo = `OLTREM${dateNow.getDay()}${dateNow.getMonth() + 1}${new Date().getFullYear()}-${
      countRemissions + 1
    }`;

    const operations = [];

    // Step 1: Create remission
    operations.push(
      this.prisma.componentes_remisiones.create({
        data: {
          id: idRemission,
          name: remission.name,
          date_remission: dateRemission,
          codigo: codigo.toUpperCase(),
          client: remission.client,
          encargado: remission.encargado,
          hospitals: {
            connect: {
              id: remission.hospital_id,
            },
          },
          users: {
            connect: {
              id: user_id_req,
            },
          },
        },
      }),
    );

    for (let component of remission.componentes) {
      // Step 2: Insert components in remission
      operations.push(
        this.prisma.componentes_has_componentes_remisiones.create({
          data: {
            id: uuid(),
            quantity: component.quantity,
            componentes: {
              connect: {
                id: component.id,
              },
            },
            componentes_remisiones: {
              connect: {
                id: idRemission,
              },
            },
          },
        }),
      );

      // Step 3: Update stock components
      const stockComponente = await this.prisma.componentes.findUnique({
        where: {
          id: component.id,
        },
        select: {
          stock: true,
          remission_stock: true,
        },
      });

      const newStock = stockComponente.stock - component.quantity;
      const newStockRemission =
        stockComponente.remission_stock + component.quantity;

      operations.push(
        this.prisma.componentes.update({
          where: {
            id: component.id,
          },
          data: {
            stock: newStock,
            remission_stock: newStockRemission,
          },
        }),
      );

      // Step 4: Add movement in inventory
      operations.push(
        this.prisma.componentes_inventory.create({
          data: {
            id: uuid(),
            quantity: component.quantity,
            tipo_movimiento: TipoMovimiento.REMISSION,
            componentes: {
              connect: {
                id: component.id,
              },
            },
          },
        }),
      );
    }

    const newRemission = await this.prisma.$transaction(operations);

    return newRemission[0];
  }

  getOneRemission(id: string) {
    return this.prisma.componentes_remisiones.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            componentes_has_componentes_remisiones: true,
          },
        },
        componentes_has_componentes_remisiones: {
          select: {
            id: true,
            quantity: true,
            componentes: {
              select: {
                id: true,
                measures: true,
                registration_date: true,
                stock: true,
                lote: true,
                caducidad: true,
                componentes_categories: true,
              },
            },
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            lastname: true,
            avatar: true,
            role: true,
          },
        },
        hospitals: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  // Esta funcion se utiliza para cancelar una remision y devolver los componentes al stock
  // Para borrar una remision sin devolver los componentes al stock, se debe utilizar la funcion "deleteRemissionWhitoutStock"
  async removeRemission(id: string) {
    await this.prisma.$transaction(
      async (prisma) => {
        // Get components in remission
        const componentsRemission =
          await prisma.componentes_has_componentes_remisiones.findMany({
            where: {
              remision_id: id,
            },
            select: {
              quantity: true,
              componente_id: true,
            },
          });

        // Update stock components
        for (let componentRemission of componentsRemission) {
          const stocksComponent = await prisma.componentes.findUnique({
            where: {
              id: componentRemission.componente_id,
            },
            select: {
              stock: true,
              remission_stock: true,
            },
          });

          const newStock = stocksComponent.stock + componentRemission.quantity;
          const newStockRemission =
            stocksComponent.remission_stock - componentRemission.quantity;

          await prisma.componentes.update({
            where: {
              id: componentRemission.componente_id,
            },
            data: {
              stock: newStock,
              remission_stock: newStockRemission,
            },
          });

          // Add movement in inventory
          await prisma.componentes_inventory.create({
            data: {
              id: uuid(),
              quantity: componentRemission.quantity,
              tipo_movimiento: TipoMovimiento.ENTRADA,
              componentes: {
                connect: {
                  id: componentRemission.componente_id,
                },
              },
            },
          });
        }

        // Delete components in remission
        await prisma.componentes_has_componentes_remisiones.deleteMany({
          where: {
            remision_id: id,
          },
        });

        // Delete remission
        return prisma.componentes_remisiones.delete({
          where: {
            id,
          },
        });
      },
      { timeout: 30000 },
    );
  }

  // Esta funcion se usa para borrar la remission SIN DEVOLVER los componentes al stock
  async deleteRemissionWhitoutStock(id: string) {
    await this.prisma.componentes_has_componentes_remisiones.deleteMany({
      where: {
        remision_id: id,
      },
    });

    return this.prisma.componentes_remisiones.delete({
      where: {
        id,
      },
    });
  }

  async finalizeRemission(idRemission, user_created_id, components) {
    await this.prisma.$transaction(
      async (prisma) => {
        const updates = [];
        const inventoryMovements = [];
        const componentUses = [];

        for (const component of components) {
          const quantityRemission = component.remission_quantity;
          const quantityDelivered = component.quantity_delivered;

          const componentOnDataBase = await prisma.componentes.findUnique({
            where: {
              id: component.id,
            },
            select: {
              stock: true,
              remission_stock: true,
            },
          });

          if (!componentOnDataBase) {
            throw new Error(`Component with ID ${component.id} not found`);
          }

          const newStock = componentOnDataBase.stock + quantityDelivered;
          const newStockRemission =
            componentOnDataBase.remission_stock - quantityRemission;

          updates.push(
            prisma.componentes.update({
              where: {
                id: component.id,
              },
              data: {
                stock: newStock,
                remission_stock: newStockRemission,
              },
            }),
          );

          inventoryMovements.push(
            prisma.componentes_inventory.create({
              data: {
                id: uuid(),
                quantity: quantityDelivered,
                tipo_movimiento: TipoMovimiento.ENTRADA,
                componentes: {
                  connect: {
                    id: component.id,
                  },
                },
              },
            }),
          );

          const lossAmount = quantityRemission - quantityDelivered;
          if (lossAmount > 0) {
            const remission = await prisma.componentes_remisiones.findUnique({
              where: {
                id: idRemission,
              },
              select: {
                codigo: true,
                user_id: true,
                hospital_id: true,
              },
            });

            if (!remission) {
              throw new Error(`Remission with ID ${idRemission} not found`);
            }

            componentUses.push(
              prisma.componentes_used.create({
                data: {
                  id: uuid(),
                  quantity: lossAmount,
                  patient: `Remisión ${remission.codigo}`,
                  used_date: new Date(),
                  componentes: {
                    connect: {
                      id: component.id,
                    },
                  },
                  users: {
                    connect: {
                      id: remission.user_id,
                    },
                  },
                  hospitals: {
                    connect: {
                      id: remission.hospital_id,
                    },
                  },
                },
              }),
            );

            inventoryMovements.push(
              prisma.componentes_inventory.create({
                data: {
                  id: uuid(),
                  quantity: lossAmount,
                  tipo_movimiento: TipoMovimiento.SALIDA,
                  componentes: {
                    connect: {
                      id: component.id,
                    },
                  },
                },
              }),
            );
          }
        }

        // Ejecutar todas las actualizaciones y movimientos en lote
        await Promise.all([
          ...updates,
          ...inventoryMovements,
          ...componentUses,
        ]);

        // Actualizar el estado de la remisión después de completar todas las operaciones anteriores
        await prisma.componentes_remisiones.update({
          where: {
            id: idRemission,
          },
          data: {
            status: 'Finalizado',
          },
        });
      },
      {
        timeout: 30000,
      },
    );
  }

  async getComponentesByCategory() {
    const componentes: any = await this.prisma.$queryRaw`
      SELECT 
        SUBSTRING(componentes_categories.name FROM '^[^ ]+') AS categoria,
        SUM(componentes.stock) AS cantidad,
        COUNT(componentes.id) AS lotes,
        SUM(componentes.remission_stock) AS remision
      FROM 
        componentes
      JOIN 
        componentes_categories
      ON
        componentes.category = componentes_categories.id
      GROUP BY 
        categoria
      ORDER BY 
        categoria;
    `;

    const componentesFormatted = componentes.map((component) => {
      return {
        category: component.categoria,
        count: parseInt(component.cantidad),
        lotes: parseInt(component.lotes),
        remision: parseInt(component.remision),
      };
    });

    return componentesFormatted;
  }

  async getComponentesBySubCategory(subCategory) {
    const searchTerm = `%${subCategory}%`; // Add the '%' wildcard to the search term

    const componentes: any = await this.prisma.$queryRaw`
    SELECT 
      componentes_categories.name AS subcategory, 
      SUM(componentes.stock) AS stock,
      SUM(componentes.remission_stock) AS remision
    FROM 
      componentes_categories
    JOIN 
      componentes
    ON
      componentes.category = componentes_categories.id
    WHERE 
      componentes_categories.name LIKE ${searchTerm}
    GROUP BY
      componentes_categories.name
  `;

    const componentesFormatted = componentes.map((component) => {
      return {
        subcategory: component.subcategory,
        stock: parseInt(component.stock),
        remision: parseInt(component.remision),
      };
    });

    return componentesFormatted;
  }

  async fixDatesUsed() {
    const componentsUsed = await this.prisma.componentes_used.findMany({
      select: {
        id: true,
        used_date: true,
      },
    });

    for (let component of componentsUsed) {
      if (component.used_date) {
        const date = new Date(component.used_date);
        const newDate = new Date(date.setHours(30, 0, 0, 0));

        await this.prisma.componentes_used.update({
          where: {
            id: component.id,
          },
          data: {
            used_date: newDate,
          },
        });
      }
    }

    return 'Done';
  }

  async updateOneComponentRemission(id: string, data: any) {
    // get component in remission
    const componentRemission =
      await this.prisma.componentes_has_componentes_remisiones.findUnique({
        where: {
          id,
        },
        select: {
          quantity: true,
          componente_id: true,
        },
      });

    // get component
    const component = await this.prisma.componentes.findUnique({
      where: {
        id: componentRemission.componente_id,
      },
    });

    // new stock
    let newStockRemission = 0;

    if (data.quantity !== componentRemission.quantity) {
      newStockRemission = Math.abs(componentRemission.quantity - data.quantity);

      if (data.quantity < componentRemission.quantity) {
        await this.prisma.componentes.update({
          where: {
            id: component.id,
          },
          data: {
            remission_stock: component.remission_stock - newStockRemission,
            stock: component.stock + newStockRemission,
          },
        });
      } else if (data.quantity > componentRemission.quantity) {
        await this.prisma.componentes.update({
          where: {
            id: component.id,
          },
          data: {
            remission_stock: component.remission_stock + newStockRemission,
            stock: component.stock - newStockRemission,
          },
        });
      }

      return await this.prisma.componentes_has_componentes_remisiones.update({
        where: {
          id,
        },
        data: {
          quantity: data.quantity,
        },
      });
    }
  }

  async removeOneComponentRemission(id: string) {
    // get component in remission
    const componentRemission =
      await this.prisma.componentes_has_componentes_remisiones.findUnique({
        where: {
          id,
        },
        select: {
          quantity: true,
          componente_id: true,
        },
      });

    // get component
    const component = await this.prisma.componentes.findUnique({
      where: {
        id: componentRemission.componente_id,
      },
    });

    // update stock component
    const newStock = component.stock + componentRemission.quantity;
    const newRemissionStock =
      component.remission_stock - componentRemission.quantity;
    await this.prisma.componentes.update({
      where: {
        id: componentRemission.componente_id,
      },
      data: {
        stock: newStock,
        remission_stock: newRemissionStock,
      },
    });

    // delete component in remission
    return this.prisma.componentes_has_componentes_remisiones.delete({
      where: {
        id,
      },
    });
  }

  async updateDetailsRemission(id: string, detailsToUpdate) {
    const { date_remission, hospital_id, ...details } = detailsToUpdate;

    if (date_remission) {
      detailsToUpdate.date_remission = `${detailsToUpdate.date_remission}T12:00:00Z`;
    }

    if (hospital_id) {
      detailsToUpdate.hospital_id = parseInt(hospital_id);
    }

    const updateRemissionDetails =
      await this.prisma.componentes_remisiones.update({
        where: {
          id,
        },
        data: {
          ...detailsToUpdate,
        },
      });

    return updateRemissionDetails;
  }

  async addComponentRemission(id: string, component) {
    // Insert component in remission
    const newComponent =
      await this.prisma.componentes_has_componentes_remisiones.create({
        data: {
          id: uuid(),
          quantity: component.quantity,
          componentes: {
            connect: {
              id: component.id,
            },
          },
          componentes_remisiones: {
            connect: {
              id,
            },
          },
        },
      });

    // Update stock component
    const componentToUpdate = await this.prisma.componentes.findUnique({
      where: {
        id: component.id,
      },
    });

    const newStock = componentToUpdate.stock - component.quantity;
    const newRemissionStock =
      componentToUpdate.remission_stock + component.quantity;

    await this.prisma.componentes.update({
      where: {
        id: component.id,
      },
      data: {
        stock: newStock,
        remission_stock: newRemissionStock,
      },
    });

    return newComponent;
  }
}
