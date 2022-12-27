import { MatTableDataSource } from "@angular/material/table";
import { EmployeeShift } from "./employee-shift.model";

export class EmployeeInfo {
    Id: number;
    Name?: string;
    Email?: string;
    HourlyRate?: number;
    OvertimeHourlyRate?: number;
    Status?: EmployeeStatus;
    SelectedDate?: Date;
    ValidDates: Date[];
    Shifts: EmployeeShift[];
    EmployeeShift : MatTableDataSource<EmployeeShift>;
    constructor(Id: number) {
        this.Id = Id;
        this.EmployeeShift = new MatTableDataSource<EmployeeShift>();
        this.Shifts = [];
        this.ValidDates = [];
    }

}

export enum EmployeeStatus {
    Active,
    InActive
}