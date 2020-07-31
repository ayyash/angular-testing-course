import { CoursesService } from './courses.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { COURSES, LESSONS, findLessonsForCourse } from '../../../../server/db-data';
import { Course } from '../model/course';
import { HttpErrorResponse } from '@angular/common/http';


xdescribe("CourseService", () => {

  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {

    // httpSpy = jasmine.createSpy('httpSpy', HttpClient)
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CoursesService
      ]
    });

    coursesService = TestBed.inject(CoursesService);

    httpTestingController = TestBed.inject(HttpTestingController);

  });

  it('should retrieve all courses', () => {

    coursesService.findAllCourses().subscribe(courses => {
      expect(courses).toBeTruthy('no courses returned');

      expect(courses.length).toBe(12, "incorrect numbver of coureses");

      const _course = courses.find(course => course.id === 12);

      expect(_course.titles.description).toBe("Angular Testing Course", "wrong course");
    });

    // create call
    const req = httpTestingController.expectOne('/api/courses');
    expect(req.request.method).toEqual('GET');

    // flush mock data
    req.flush({
      payload:
        Object.values(COURSES)
    });

    // httpTestingController.verify(); // only one call is made
  });

  it('should find course by id', () => {

    coursesService.findCourseById(12).subscribe(course => {
      expect(course).toBeTruthy();

      expect(course.id).toBe(12, "incorrect course");

      expect(course.titles.description).toBe("Angular Testing Course", "wrong course");
    });

    // create call
    const req = httpTestingController.expectOne('/api/courses/12');
    expect(req.request.method).toEqual('GET');

    // flush mock data
    req.flush(COURSES[12]);


  });

  it('should save the course data', () => {

    const changes: Partial<Course> = {titles: {description: 'ayyash'}};

    coursesService.saveCourse(12, changes )
      .subscribe(c => {
        // in save, i never really recieve anything from api, if i do, i want to test THAT, not the mock service!
        // this does sound like redundant
        expect(c.id).toBe(12);
        // expect(c.titles.description).toEqual('ayyash');

      });

      const req = httpTestingController.expectOne('/api/courses/12');
      expect(req.request.method).toEqual('PUT');

      expect(req.request.body.titles.description).toEqual(changes.titles.description);

      // did i really test the servie!!!
      req.flush({
        ...COURSES[12], ...changes
      });


  });

  it('should give an error if save fails', () =>{
    const changes: Partial<Course> = {titles: {description: 'ayyash'}};

      coursesService.saveCourse(12, changes).subscribe(
        c => {
          fail('this sould have failed');
        },
        // TODO: my error object
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);

        }
      );

      const req = httpTestingController.expectOne('/api/courses/12');
      expect(req.request.method).toEqual('PUT');

      req.flush('save failed', {status: 500, statusText: 'Internal server error'});

  });


  // will probably never need this kind of testing
  it('should find lessons', () => {


    coursesService.findLessons(12)
      .subscribe(lessons => {
        expect(lessons).toBeTruthy();
        expect(lessons.length).toBe(3);
      });

      // predicate to allow query params!
      const req = httpTestingController.expectOne(r => r.url === '/api/lessons');
      expect(req.request.method).toEqual('GET');

      // to asset query params sent
      expect(req.request.params.get('courseId')).toEqual('12');
      expect(req.request.params.get('filter')).toEqual('');
      expect(req.request.params.get('sortOrder')).toEqual('asc');
      expect(req.request.params.get('pageNumber')).toEqual('0');
      expect(req.request.params.get('pageSize')).toEqual('3');

      // req.flush({payload: Object.values(LESSONS).filter(n => n.courseId === 12).slice(3)});
      // or get lessons the slice to 3
      req.flush({payload: findLessonsForCourse(12).slice(0, 3)});

  });

  afterEach(() => {
    // verify one call is made?! no uninteded calls
    httpTestingController.verify();
  });


});
