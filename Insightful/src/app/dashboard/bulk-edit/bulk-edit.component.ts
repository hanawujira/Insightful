import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeInfo } from 'src/app/model/employee-info.model';
import { EmployeeShift } from 'src/app/model/employee-shift.model';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';

@Component({
  selector: 'app-bulk-edit',
  templateUrl: './bulk-edit.component.html',
  styleUrls: ['./bulk-edit.component.scss']
})
export class BulkEditComponent implements OnInit {
  displayedColumns: string[] = ['EmployeeId', 'ClockIn', 'ClockOut', 'WorkedHours'];
  employees: EmployeeInfo[] = [];
  employeeShift = new MatTableDataSource<EmployeeShift>();
  constructor(private dashboardService: DashboardService, public dialogRef: MatDialogRef<BulkEditComponent>, @Inject(MAT_DIALOG_DATA) public data: EmployeeInfo[]) { }

  ngOnInit(): void {
    this.getEmployeeShift();
  }

  getEmployeeShift() {
    let employeeIds = this.data.map(t => t.Id);
    this.dashboardService.getEmployeeShift(employeeIds).subscribe(result => {
      this.employees = result;
      this.employees.forEach(t => {
        t.EmployeeShift = new MatTableDataSource<EmployeeShift>();
        t.EmployeeShift.data = t.Shifts
        t.ValidDates = [... new Set(t.Shifts)].map(t => t.Date ? t.Date : new Date()).sort((a, b) => {
          return new Date(b).valueOf() - new Date(a).valueOf()
        });
      }
      )
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  saveChanges(){
    this.dashboardService.saveChanges(this.employees);
    this.closeDialog();
  }
}
