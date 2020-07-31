import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursesCardListComponent } from './courses-card-list.component';
import { CoursesModule } from '../courses.module';
import { COURSES } from '../../../../server/db-data';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { sortCoursesBySeqNo } from '../home/sort-course-by-seq';
import { Course } from '../model/course';
import { setupCourses } from '../common/setup-test-data';




describe('CoursesCardListComponent', () => {

  let component: CoursesCardListComponent;

  let fixture: ComponentFixture<CoursesCardListComponent>;

  let el: DebugElement;

  // use asycn wrapper to avoid async issues, it waits 5 seconds before testing
  beforeEach(async(
    () => {
      TestBed.configureTestingModule({
        // declarations: [

        // ],
        imports: [
          CoursesModule
        ],
        providers: []
      })
        .compileComponents()
        .then(() => {
          // wait for compilation, create a component of type then get instance
          fixture = TestBed.createComponent(CoursesCardListComponent);
          component = fixture.componentInstance;
          el = fixture.debugElement; // the dom
        });
    })
  );

  it("should create the component", () => {

    // wait for beforeach
    expect(component).toBeTruthy();

  });


  it("should display the course list", () => {

    // sync test
    component.courses = setupCourses();

    // input changes, detect changes
    fixture.detectChanges();

    // console.log(el.nativeElement.outerHTML);

    const cards = el.queryAll(By.css('.course-card'));

    expect(cards).toBeTruthy('no cards');

    expect(cards.length).toBe(12, 'not full list');


  });


  it("should display the first course", () => {

    component.courses = setupCourses();

    fixture.detectChanges();

    const course = component.courses[0];
    const card = el.query(By.css('.course-card'));
    const title = card.query(By.css('mat-card-title')); // selector tag
    const image = card.query(By.css('img'));

    expect(card).toBeTruthy('card not found');

    expect(title.nativeElement.textContent).toBe(course.titles.description);
    expect(image.nativeElement.src).toBe(course.iconUrl);


  });


});


