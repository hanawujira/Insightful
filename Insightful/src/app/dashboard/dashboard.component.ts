import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { observable, Observable } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';

import { EmployeeInfo } from '../model/employee-info.model';
import { DashboardService } from '../service/dashboard/dashboard.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { BulkEditComponent } from './bulk-edit/bulk-edit.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  employeeList= new MatTableDataSource<EmployeeInfo>();
  displayedColumns: string[] = [
    'select',
    'Id',
    'Name',
    'Email',
    'HourlyRate',
    'OvertimeHourlyRate'
  ];
  selection = new SelectionModel<EmployeeInfo>(true, []);

  constructor(private dashboardService: DashboardService, private matDialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getEmployeeList();
  }

  getEmployeeList() {
    this.dashboardService.getEmployeeInfo().subscribe(result => {
      if(!this.dashboardService.employeeInfo || this.dashboardService.employeeInfo.length === 0){
        this.dashboardService.employeeInfo = result;
      }
      this.employeeList.data = result;
    })
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.employeeList.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.employeeList.data);
  }

  checkboxLabel(row?: EmployeeInfo): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${0 + 1}`;
  }

  openDialog(): void {
    this.matDialog.open(BulkEditComponent, {
      height: '800px',
      width: '900px',
      data: this.selection.selected
    });
  }

}
