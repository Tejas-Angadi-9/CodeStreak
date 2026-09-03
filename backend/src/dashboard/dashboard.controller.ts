import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ROUTES } from 'src/common/constants/routes';
import DashboardService from './dashboard.service';
import JwtGuard from 'src/common/guards/jwt.guard';
import CurrentUser from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { DashboardDto } from './dto/dashboard.dto';

@Controller(ROUTES.DASHBOARD.BASE)
@UseGuards(JwtGuard)
class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get(ROUTES.DASHBOARD.BY_ROOM_CODE)
  public async fetchDashboardDetails(
    @Param() DashboardDto: DashboardDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const { roomCode } = DashboardDto;
    return await this.dashboardService.fetchDashboardDetails(user.sub, roomCode);
  }
}
export default DashboardController;
