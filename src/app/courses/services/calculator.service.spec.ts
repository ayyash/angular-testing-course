
import { CalculatorService } from './calculator.service';
import { LoggerService } from './logger.service';
import { TestBed } from '@angular/core/testing';

// prefix x to disable, prefix f to focus and run only
xdescribe('CalculateService', () => {

  let calculator: CalculatorService;
  let loggerSpy: any;

  beforeEach(() => {
    loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);
    // this
    // calculator = new CalculatorService(loggerSpy);

    // or this
    TestBed.configureTestingModule({
        providers: [
          CalculatorService,
          {provide: LoggerService, useValue: loggerSpy}
        ]
    });

    calculator = TestBed.inject(CalculatorService);

  });

  it('should add two numbers', () => {

    console.log('add text');
    // const logger = new LoggerService();
    // spyOn(logger, "log");

    // const loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);

    // loggerSpy.log.and.returnValue();

    // const calculator = new CalculatorService(loggerSpy);


    const result = calculator.add(2, 2);
    expect(result).toBe(4);

    expect(loggerSpy.log).toHaveBeenCalledTimes(1);

  });

  xit('should subtract two numbers', () => {

    console.log('subtract test');

    const result = calculator.subtract(2, 2);
    expect(result).toBe(0, "unexpected result");
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

});

