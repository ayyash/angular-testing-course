
import { fakeAsync, tick, flush, flushMicrotasks } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

describe('async examples', () => {

  it('async example with jasmin', (done: DoneFn) => {

    let test = false;

    // fake async
    setTimeout(() => {
      console.log('assert');
      test = true;
      expect(test).toBeTruthy();

      done();
    }, 1000);

  });

  it('async example with jasmin', fakeAsync(() => {

    let test = false;

    setTimeout(() => {

    }, 0);
    // fake async
    setTimeout(() => {
      test = true;
    }, 1000);

    // set time forward insize zone
    // tick(1000);

    // or flush all timeouts
    flush();
    console.log('assert');

    expect(test).toBeTruthy();

  }));


  it('promises', fakeAsync(() => {
    let test = false;
    console.log('promise');

    Promise.resolve().then(() => {
      console.log('evaluated');
      return Promise.resolve();
    }).then(() => {
      test = true;
      console.log('second resolve');
    });

    console.log('normal');

    flushMicrotasks();

    expect(test).toBeTruthy();
  }));

  it('asycn test promise plus timeout', fakeAsync(() => {
    let counter = 0;

    Promise.resolve().then(() => {
      counter += 10;
      setTimeout(() => {
        counter += 1;
      }, 1000);
    });

    expect(counter).toBe(0);

    // for promsises
    flushMicrotasks();

    expect(counter).toBe(10);

    // tick forward
    tick(500);

    expect(counter).toBe(10);

    tick(500);
    expect(counter).toBe(11);

  }));


  it('Async example with observables', fakeAsync(() => {
    let test = false;

    console.log('create obser');

    const test$ = of(test).pipe(
      delay(1000)
    );

    test$.subscribe(() => {
      test = true;
    });

    tick(1000);

    console.log('test asseti');
    expect(test).toBe(true);

  }));

});
