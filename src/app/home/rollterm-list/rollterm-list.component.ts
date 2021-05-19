import { Component, OnInit } from "@angular/core";
const dumbData = [{}];

@Component({
  selector: "midas-rollterm-list",
  templateUrl: "./rollterm-list.component.html",
  styleUrls: ["./rollterm-list.component.scss"],
})
export class RolltermListComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  panelOpenState = false;
  data = dumbData;
}
