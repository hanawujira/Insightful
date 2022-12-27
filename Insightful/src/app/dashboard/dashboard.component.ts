import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  totalClockedTime: number = 0;
  totalRegularHourPaid: number = 0;
  totalOvertimePaidAmount: number = 0;
  displayedColumns: string[] = [
    'select',
    'Id',
    'Name',
    'Email',
    'TotalClockedInTime',
    'TotalAmountPaid',
    'TotalOvertimeAmountPaid'
  ];
  selection = new SelectionModel<EmployeeInfo>(true, []);

  constructor(private dashboardService: DashboardService, private matDialog: MatDialog, private cdr: ChangeDetectorRef) {
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
      const initialValue = 0;
      this.totalClockedTime =  Math.floor(result.map(t => t.TotalClockedInTime).reduce(
        (accumulator, currentValue) => accumulator! + currentValue!,
        initialValue
      )!);
      this.totalOvertimePaidAmount =  Math.floor(result.map(t => t.TotalOvertimeAmountPaid).reduce(
        (accumulator, currentValue) => accumulator! + currentValue!,
        initialValue
      )!);
      this.totalRegularHourPaid =  Math.floor(result.map(t => t.TotalAmountPaid).reduce(
        (accumulator, currentValue) => accumulator! + currentValue!,
        initialValue
      )!);
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
   const dialogRef = this.matDialog.open(BulkEditComponent, {
      height: '800px',
      width: '900px',
      data: this.selection.selected
    });

    dialogRef.afterClosed().subscribe(result => {
      this.cdr.markForCheck();
    });
  }

  kFormatter(num: number) {
    return Math.abs(num) > 999 
    ? Math.sign(num) * +(Math.abs(num) / 1000).toFixed(1) + 'k' 
    : Math.sign(num) * Math.abs(num);
  }
}
