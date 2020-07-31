
import { async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick } from '@angular/core/testing';
import { CoursesModule } from '../courses.module';
import { DebugElement } from '@angular/core';

import { HomeComponent } from './home.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoursesService } from '../services/courses.service';
import { HttpClient } from '@angular/common/http';
import { COURSES } from '../../../../server/db-data';
import { setupCourses } from '../common/setup-test-data';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { click } from '../common/test-utils';





describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any;

  beforeEach(async(
    () => {

      const coursesSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);


      TestBed.configureTestingModule({
        // declarations: [

        // ],
        imports: [
          CoursesModule,
          NoopAnimationsModule
        ],
        providers: [
          { provide: CoursesService, useValue: coursesSpy }
        ]
      })
        .compileComponents()
        .then(() => {
          // wait for compilation, create a component of type then get instance
          fixture = TestBed.createComponent(HomeComponent);
          component = fixture.componentInstance;
          el = fixture.debugElement; // the dom
          // this injects the spy
          coursesService = TestBed.inject(CoursesService);
        });
    })
  );

  it("should create the component", () => {

    expect(component).toBeTruthy();

  });

  const beginnerCourses = setupCourses().filter(n => n.category === 'BEGINNER');
  const advancedCourses = setupCourses().filter(n => n.category === 'ADVANCED');

  it("should display only beginner courses", () => {

    // mock a call, that returns only beginner courses, and see if the other tab is not displayed
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses)); // return what findAllCourses expect

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length).toBe(1, "advanced is showing");

  });


  it("should display only advanced courses", () => {

    // mock a call, that returns only beginner courses, and see if the other tab is not displayed
    coursesService.findAllCourses.and.returnValue(of(advancedCourses)); // return what findAllCourses expect

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length).toBe(1, "beginner is showing");

  });


  it("should display both tabs", () => {

    coursesService.findAllCourses.and.returnValue(of(setupCourses())); // return what findAllCourses expect

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));
    expect(tabs.length).toBe(2, "both should be showing");

  });


  xit("should display advanced courses when tab clicked", (done: DoneFn) => {
    // this cannot be property tested

    coursesService.findAllCourses.and.returnValue(of(setupCourses())); // return what findAllCourses expect

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));
    click(tabs[1]);

    // wait for component to respond completely, which is not exact math
    fixture.detectChanges();

    setTimeout(() => {

      // this somehow returns the whole list of 12 items!!!!
      const titles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));

      expect(titles.length).toBeGreaterThan(0, 'could not find card titles');
      // mat-tab-label-active
      expect(titles[0].nativeElement.textContent).toContain('Angular Security'); // too specific, this is useless

      // indicate done, default time out is 5 seconds
      done();
    }, 500);



  });



  xit("should display advanced courses when tab clicked", fakeAsync(() => {
    // this cannot be property tested

    coursesService.findAllCourses.and.returnValue(of(setupCourses())); // return what findAllCourses expect

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));
    click(tabs[1]);

    fixture.detectChanges();
    // wait for component to respond completely, which is not exact math
    flush();

    // tick in requestAnimationFrame
    // tick(16);

    // this somehow returns the whole list of 12 items!!!!
    const titles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));

    expect(titles.length).toBeGreaterThan(0, 'could not find card titles');
    // mat-tab-label-active
    expect(titles[0].nativeElement.textContent).toContain('Angular Security'); // too specific, this is useless


  }));



  it("should display advanced courses when tab clicked - async", async(() => {
    // asycn, cannot call flush or tick
    // in http call, use async

    coursesService.findAllCourses.and.returnValue(of(setupCourses())); // return what findAllCourses expect

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mat-tab-label'));
    click(tabs[1]);

    fixture.detectChanges();

    // called by async to signal completion
    fixture.whenStable().then(() => {

      // this somehow returns the whole list of 12 items!!!!
      const titles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));

      expect(titles.length).toBeGreaterThan(0, 'could not find card titles');
      // mat-tab-label-active
      expect(titles[0].nativeElement.textContent).toContain('Angular Security'); // too specific, this is useless
    });



  }));

});


