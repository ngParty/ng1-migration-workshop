import { Component } from 'ng-metadata/core';
@Component({
  selector:'pc-app',
  template:`
  <nav class="navbar navbar-default navbar-fixed-top">
    <div class="container-fluid">
      <div class="navbar-header">
        <a class="navbar-brand" href="#">Google phones app</a>
      </div>
    </div>
  </nav>

  <div class="view-container">
    <div ng-view class="view-frame"></div>
  </div>
  `
})
export class AppComponent{}
