import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from "@angular/router";

import { calendar as CalendarData} from '../../data/calendardata';

import * as Moment from 'moment';
import * as MomentRange from 'moment-range';
const moment = MomentRange.extendMoment(Moment);

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.rendered.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements AfterViewInit, OnInit {
  calendar = CalendarData;

  constructor(
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId: any,
        private router: Router
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // If we're in the browser
    if (isPlatformBrowser(this.platformId)) {
      // If we're initialized with an anchor, navigate to that anchor, otherwise to the top
      let element = null;
      let fragment = this.router.parseUrl(this.router.url).fragment;
      if (fragment) {
        element = this.document.querySelector('#' + fragment);
      }
      if (element) {
        element.scrollIntoView();
      } else {
        this.document.scrollingElement.scroll(0, 0);
      }
    }
  }

  datesOfInstructionByWeek() {
    return moment.range(
      this.calendar.datesOfInstruction.start,
      this.calendar.datesOfInstruction.end
    ).snapTo('weeks').by('weeks');
  }

  datesOfWeekdaysForWeek(currentWeek: Date) {
    return moment.range(
      moment(moment(currentWeek)).add('1', 'days'),
      moment(moment(currentWeek)).add('5', 'days')
    ).by('days');
  }

  getAssignmentsForDay(currentDay: Date) {
    return this.calendar.assignments.filter((assignmentCurrent) => {
      return moment(assignmentCurrent.date).isSame(moment(currentDay));
    });
  }

  getAwaysForDay(currentDay: Date) {
    return this.calendar.aways.filter((awayCurrent) => {
      return moment(awayCurrent.date).isSame(moment(currentDay));
    });
  }

  getHolidaysForDay(currentDay: Date) {
    return this.calendar.holidays.filter((holidayCurrent) => {
      return moment(holidayCurrent.date).isSame(moment(currentDay));
    });
  }

  getLecturesForDay(currentDay: Date) {
    return this.calendar.lectures.filter((lectureCurrent) => {
      return moment(lectureCurrent.date).isSame(moment(currentDay));
    }).map((lectureCurrent) => {
      if('locationName' in lectureCurrent) {
        // ! per https://github.com/Microsoft/TypeScript/issues/11498
        lectureCurrent!.location = this.calendar.locations[lectureCurrent.locationName];
      } else {
        // ! per https://github.com/Microsoft/TypeScript/issues/11498
        lectureCurrent!.location = this.calendar.locations.lecture;
      }

      return lectureCurrent;
    });
  }

  getOfficeHoursForDay(currentDay: Date) {
    return this.calendar.officeHours.filter((officeHourCurrent) => {
      return moment(officeHourCurrent.date).isSame(moment(currentDay));
    }).map((officeHourCurrent) => {
      if('locationName' in officeHourCurrent) {
        // ! per https://github.com/Microsoft/TypeScript/issues/11498
        officeHourCurrent!.location = this.calendar.locations[officeHourCurrent.locationName];
      }

      return officeHourCurrent;
    });
  }

  getMajorsForDay(currentDay: Date) {
    return this.calendar.majors.filter((majorCurrent) => {
      return moment(majorCurrent.date).isSame(moment(currentDay));
    }).map((majorCurrent) => {
      if('locationName' in majorCurrent) {
        // ! per https://github.com/Microsoft/TypeScript/issues/11498
        majorCurrent!.location = this.calendar.locations[majorCurrent.locationName];
      }

      return majorCurrent;
    });
  }

  getSectionsForDay(currentDay: Date) {
    return this.calendar.sections.filter((sectionCurrent) => {
      return moment(sectionCurrent.date).isSame(moment(currentDay));
    }).map((sectionCurrent) => {
      if('locationName' in sectionCurrent) {
        // ! per https://github.com/Microsoft/TypeScript/issues/11498
        sectionCurrent!.location = this.calendar.locations[sectionCurrent.locationName];
      } else {
        // ! per https://github.com/Microsoft/TypeScript/issues/11498
        sectionCurrent!.location = this.calendar.locations.section;
      }

      return sectionCurrent;
    });
  }

  moment(currentDay: Date) {
    return moment(currentDay);
  }
}
