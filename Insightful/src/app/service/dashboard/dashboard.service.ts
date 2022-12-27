import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { off } from 'process';
import { delay, map, Observable, of } from 'rxjs';
import { EmployeeInfo } from 'src/app/model/employee-info.model';
import { EmployeeShift } from 'src/app/model/employee-shift.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  employeeInfo: EmployeeInfo[] = [];
  

  constructor(private http: HttpClient) { }

  getEmployeeInfo(): Observable<EmployeeInfo[]> {
    let apiURL = '/assets/employee-info.json';
    if(this.employeeInfo && this.employeeInfo.length > 0){
      return of(this.employeeInfo).pipe(delay(300));
    } 
    return this.http.get<EmployeeInfo[]>(apiURL).pipe(map(t=>{
      return this.mapEmployeeInfo(t);
    }));
  }

  getEmployeeShift(employees: number[]): Observable<EmployeeInfo[]> {
    let apiURL = '/assets/employee-info.json';
    if (this.employeeInfo && this.employeeInfo.length > 0) {
      return of(this.employeeInfo).pipe(delay(300), map(res => {
        return res.filter(t => employees.includes(t.Id))
      }));
    }
    return this.http.get<EmployeeInfo[]>(apiURL).pipe(map(res => {
      return res.filter(t => employees.includes(t.Id))
    }));
  }

  saveChanges(employees: EmployeeInfo[]){
    employees.forEach(employee=> {
      let index = this.employeeInfo.indexOf(employee);
      if(index > -1){
        this.employeeInfo.splice(index, 1, employee);
      }
    })
  }

  mapEmployeeInfo(employeeInfos: EmployeeInfo[]){
    employeeInfos.forEach(employeeInfo=>{
      employeeInfo.Shifts.map(t=>{
        let clockInDateTime = `${t.Date} ${t.ClockIn}`;
        let clockOutDateTime = `${t.Date} ${t.ClockOut}`;
        t.WorkedHours = Math.floor(Math.abs(new Date(clockOutDateTime)?.getTime()! - new Date(clockInDateTime)?.getTime()!) / 36e5);
        t.RegularHours = t.WorkedHours > 8 ? 8 : t.WorkedHours;
        t.OTHours = t.WorkedHours > 8 ? t.WorkedHours - 8 : 0;
        return t;
      });
      const initialValue = 0;
      employeeInfo.TotalClockedInTime = employeeInfo.Shifts.map(t=>t.WorkedHours!).reduce((accumulator, currentValue) => accumulator + currentValue,
      initialValue);
      employeeInfo.TotalOvertimeAmountPaid = employeeInfo.Shifts.map(t=>t.OTHours!).reduce((accumulator, currentValue) => accumulator + currentValue,
      initialValue) * employeeInfo.OvertimeHourlyRate!;
      employeeInfo.TotalAmountPaid = employeeInfo.Shifts.map(t=>t.RegularHours!).reduce((accumulator, currentValue) => accumulator + currentValue,
      initialValue) * employeeInfo.HourlyRate!;
    })
    return employeeInfos;
  }
}
