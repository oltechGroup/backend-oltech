import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  Put,
  Req,
} from '@nestjs/common';
import { ComponentesService } from './componentes.service';
import { CreateComponenteUsedDto } from './dto/create-componente-used.dto';
import {
  ResponsePagination,
  ResponseSuccess,
} from 'src/common/dto/response.dto';
import { CreateComponenteDto } from './dto/create-componente.dto';
import { UpdateComponenteDto } from './dto/update-componente.dto';
import { UpdateComponenteUsedDto } from './dto/update-componente-used.dto';
import { CreateRemissionDto } from './dto/create-remission.dto';
import { FinalizeRemissionDto } from './dto/finalize-remission.dto';

@Controller('componentes')
export class ComponentesController {
  constructor(private readonly componentesService: ComponentesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page') page: number = 1,
    @Query('search') search: string = '',
    @Query('sort') sort: string = 'registration_date',
    @Query('order') order: string = 'desc',
  ) {
    const perPage: number = 20;
    const normalizedSearch = search.toLowerCase();

    const currentPage = parseInt(page as any);

    const totalCount = await this.componentesService.countAll({
      search: normalizedSearch,
    });

    const info = {
      success: true,
      message: 'Componentes obtenidos correctamente',
      totalCount,
      search: normalizedSearch,
      perPage,
      totalPages: Math.ceil(totalCount / 20),
      currentPage,
      next: null,
      prev: null,
    };

    const componentes = await this.componentesService.findAll({
      take: perPage,
      skip: (currentPage - 1) * perPage,
      search: normalizedSearch,
      orderBy: {
        [sort]: order,
      },
    });

    return new ResponsePagination<{}>(info, componentes);
  }

  @Get('used')
  @HttpCode(HttpStatus.OK)
  async findAllUsed(
    @Query('page') page: number = 1,
    @Query('search') search: string = '',
  ) {
    const perPage: number = 20;
    const normalizedSearch = search.toLowerCase();

    const currentPage = parseInt(page as any);
    const totalCount = await this.componentesService.countUsed({
      search: normalizedSearch,
    });

    const info = {
      success: true,
      message: 'Componentes obtenidos correctamente',
      search: normalizedSearch,
      totalCount,
      perPage,
      totalPages: Math.ceil(totalCount / 20),
      currentPage,
      next: null,
      prev: null,
    };

    const componentesUsed = await this.componentesService.findAllUsed({
      take: perPage,
      skip: (currentPage - 1) * perPage,
      search: normalizedSearch,
      orderBy: {
        registration_date: 'desc',
      },
    });

    return new ResponsePagination<{}>(info, componentesUsed);
  }

  @Get('inventory')
  @HttpCode(HttpStatus.OK)
  async findAllInventory(
    @Query('page') page: number = 1,
    @Query('search') search: string = '',
  ) {
    const perPage: number = 20;
    const normalizedSearch = search.toLowerCase();

    const currentPage = parseInt(page as any);
    const totalCount = await this.componentesService.countInventory({
      search: normalizedSearch,
    });

    const info = {
      success: true,
      message: 'Componentes obtenidos correctamente',
      search: normalizedSearch,
      totalCount,
      perPage,
      totalPages: Math.ceil(totalCount / 20),
      currentPage,
      next: null,
      prev: null,
    };

    const componentesUsed = await this.componentesService.findAllInventory({
      take: perPage,
      skip: (currentPage - 1) * perPage,
      search: normalizedSearch,
      orderBy: {
        fecha_movimiento: 'desc',
      },
    });

    return new ResponsePagination<{}>(info, componentesUsed);
  }

  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() componente: CreateComponenteDto, @Req() request: any) {
    const { user } = request;
    return this.componentesService.create(componente, user.sub);
  }

  @Post('add/used')
  @HttpCode(HttpStatus.CREATED)
  async addUsed(
    @Body() componenteUsed: CreateComponenteUsedDto,
    @Req() request: any,
  ) {
    const { user } = request;
    return this.componentesService.addUsed(componenteUsed, user.sub);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateComponenteDto: UpdateComponenteDto,
  ) {
    return this.componentesService.update(id, updateComponenteDto);
  }

  @Put('used/:id')
  @HttpCode(HttpStatus.OK)
  updateUsed(
    @Param('id') id: string,
    @Body() updateComponenteDto: UpdateComponenteUsedDto,
  ) {
    return this.componentesService.updateUsed(id, updateComponenteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.componentesService.remove(id);
  }

  @Delete('used/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeUsed(@Param('id') id: string) {
    return this.componentesService.removeUsed(id);
  }

  @Get('stadistics')
  @HttpCode(HttpStatus.OK)
  getStadistics() {
    return this.componentesService.getStadistics();
  }

  @Get('search/:search')
  @HttpCode(HttpStatus.OK)
  search(@Param('search') search: string) {
    return this.componentesService.searchComponente(search);
  }

  @Get('categories')
  @HttpCode(HttpStatus.OK)
  getCategories() {
    return this.componentesService.getCategories();
  }

  @Get('remissions')
  @HttpCode(HttpStatus.OK)
  async getRemissions(
    @Query('page') page: number = 1,
    @Query('search') search: string = '',
  ) {
    const perPage: number = 20;
    const normalizedSearch = search.toLowerCase();

    const currentPage = parseInt(page as any);
    const totalCount = await this.componentesService.countRemissions({
      search: normalizedSearch,
    });

    const info = {
      success: true,
      message: 'Remisiones obtenidas correctamente',
      search: normalizedSearch,
      totalCount,
      perPage,
      totalPages: Math.ceil(totalCount / 20),
      currentPage,
      next: null,
      prev: null,
    };

    const remissions = await this.componentesService.findAllRemissions({
      take: perPage,
      skip: (currentPage - 1) * perPage,
      search: normalizedSearch,
      orderBy: {
        registration_date: 'desc',
      },
    });

    return new ResponsePagination<{}>(info, remissions);
  }

  @Post('add/remission')
  @HttpCode(HttpStatus.CREATED)
  addRemission(@Body() remission: CreateRemissionDto, @Req() request: any) {
    const { user } = request;

    return this.componentesService.createRemission(remission, user.sub);
  }

  @Get('remission/:id')
  @HttpCode(HttpStatus.OK)
  async getRemission(@Param('id') id: string) {
    const remission = await this.componentesService.getOneRemission(id);

    return new ResponseSuccess<{}>('Remission OK', remission);
  }

  // borrar remision y devolver stock a componentes
  @Delete('remission/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeRemission(@Param('id') id: string) {
    return this.componentesService.removeRemission(id);
  }

  // borrar remision sin afectar stock de componentes
  @Delete('remission/drop/:idRemission')
  @HttpCode(HttpStatus.NO_CONTENT)
  dropRemission(@Param('idRemission') idRemission: string) {
    return this.componentesService.deleteRemissionWhitoutStock(idRemission);
  }

  @Post('remission/finalize/:idRemission')
  @HttpCode(HttpStatus.OK)
  finalizeRemission(
    @Param('idRemission') idRemission: string,
    @Req() request: any,
    @Body() components: FinalizeRemissionDto,
  ) {
    return this.componentesService.finalizeRemission(
      idRemission,
      request.user.sub,
      components.componentes,
    );
  }

  @Post('fixdates-used')
  @HttpCode(HttpStatus.OK)
  fixDatesUsed() {
    return this.componentesService.fixDatesUsed();
  }

  @Get('grouped')
  @HttpCode(HttpStatus.OK)
  async getByCategories() {
    const componentes =
      await this.componentesService.getComponentesByCategory();

    return {
      info: {
        success: true,
        message: 'Componentes obtenidos correctamente',
      },
      data: componentes,
    };
  }

  @Get('grouped/:category')
  @HttpCode(HttpStatus.OK)
  async getByCategory(@Param('category') category: string) {
    const componentes =
      await this.componentesService.getComponentesBySubCategory(category);

    return {
      info: {
        success: true,
        message: 'Componentes obtenidos correctamente',
      },
      data: componentes,
    };
  }

  @Get('subcategory/:subcategory')
  @HttpCode(HttpStatus.OK)
  async getAllBySubcategory(
    @Param('subcategory') subcategory: string,
    @Query('sort') sort: string = 'registration_date',
    @Query('order') order: string = 'desc',
  ) {
    const componentes = await this.componentesService.findAllBySubcategory(
      {
        sort,
        order,
      },
      subcategory,
    );

    return {
      info: {
        success: true,
        message: 'Componentes obtenidos correctamente',
      },
      data: componentes,
    };
  }

  @Put('update/details-remission/:idRemission')
  @HttpCode(HttpStatus.OK)
  async updateDetailsRemission(
    @Param('idRemission') idRemission: string,
    @Body() details: any,
  ) {
    return this.componentesService.updateDetailsRemission(idRemission, details);
  }

  @Put('update/component-remission/:idComponentRemission')
  @HttpCode(HttpStatus.OK)
  async updateComponentRemission(
    @Param('idComponentRemission') idComponentRemission: string,
    @Body() component: any,
  ) {
    return this.componentesService.updateOneComponentRemission(
      idComponentRemission,
      component,
    );
  }

  @Post('add/component-remission/:idRemission')
  @HttpCode(HttpStatus.CREATED)
  async addComponentRemission(
    @Param('idRemission') idRemission: string,
    @Body() component: any,
  ) {
    return this.componentesService.addComponentRemission(
      idRemission,
      component,
    );
  }

  @Delete('remove/component-remission/:idComponentRemission')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeComponentRemission(
    @Param('idComponentRemission') idComponentRemission: string,
  ) {
    return this.componentesService.removeOneComponentRemission(
      idComponentRemission,
    );
  }
}
