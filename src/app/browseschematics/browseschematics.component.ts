import { Component, OnInit, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import { ConfigService } from '../service/config.service';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FormschemamodalComponent } from '../formschemamodal/formschemamodal.component';
import {YesnoComponent} from '../yesno/yesno.component';
import { Schemahead } from '../interfaces/schemahead';
@Component({
  selector: 'app-browseschematics',
  templateUrl: './browseschematics.component.html',
  styleUrls: ['./browseschematics.component.scss']
})
export class BrowseschematicsComponent implements OnInit {
  dataSource = new MatTableDataSource<Schemahead>([]);
  schema: Schemahead[] = [];
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private route: Router, public dialog: MatDialog, private configservice: ConfigService) { }
  ngOnInit(): void {
    this.schema = [ ...this.configservice.getschema()];
    this.dataSource.data = this.schema;
    this.dataSource.paginator = this.paginator;
  }

  add() {
    const dialogRef = this.dialog.open(FormschemamodalComponent, {
      width: '500px',
      disableClose: false,
      // tslint:disable-next-line: max-line-length
      data: { id: 0, name: '', description: '', imports: '', fields: '' , security: false, classsecurity: '', filesecurity: '', mastersecurity:false} as Schemahead
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data !== undefined) {
        if ( this.schema.length === undefined){
          data.id = 1;
        } else {
        data.id = this.schema.length + 1; }
        this.schema.push(data);
        this.dataSource.data = this.schema;
        this.table.renderRows();
        console.log('schema:', this.schema);
        this.configservice.addschema(data);
      }
    });
  }

  delete(id: number) {
    const dialogRef = this.dialog.open(YesnoComponent, { width: '300px',
    disableClose: true,
  data: 'delete all schema'});
    dialogRef.afterClosed().subscribe( data => { if (data !== undefined){
      this.schema.splice(id - 1, 1);
      // renum schema
      for (let index = 0; index < this.schema.length; index++) {
        this.schema[index].id = index + 1;
      }
      this.configservice.renumanddelete(id);
      this.dataSource.data = this.schema;
      this.table.renderRows();
  }});
  }

  edit(id: number) {
    // tslint:disable-next-line: variable-name
    const _data = { ...this.schema[id - 1]};
    const dialogRef = this.dialog.open(FormschemamodalComponent, {
      width: '500px',
      disableClose: true,
      data: _data
    });
    dialogRef.afterClosed().subscribe(data => { if (data !== undefined){
      this.schema[id - 1] = data;
      this.dataSource.data = this.schema;
      this.table.renderRows();
      this.configservice.editschema(data, id - 1);
    }});
  }

  save() {
    const dialogRef = this.dialog.open(YesnoComponent, { width: '300px',
    disableClose: true, data: 'Save file'});
    dialogRef.afterClosed().subscribe( data => { if (data !== undefined){
    this.configservice.save(); }});
  }

  load(){
    const dialogRef = this.dialog.open(YesnoComponent, { width: '300px',
    disableClose: true, data: 'Load file and lose data'});
    dialogRef.afterClosed().subscribe( data => { if (data !== undefined){
      this.configservice.load();
      this.schema = [ ...this.configservice.getschema()];
      this.dataSource.data = this.schema;
      this.table.renderRows();
    }});
  }

  // tslint:disable-next-line: variable-name
  edit_data(_id: number){
    this.route.navigate(['/schematics', _id]);
  }

  // tslint:disable-next-line: variable-name
  edit_api(_id: number){
    this.route.navigate(['/api', _id]);
  }

  // tslint:disable-next-line: variable-name
  relations(_id: number){
    this.route.navigate(['browserelations', _id]);
  }
}
