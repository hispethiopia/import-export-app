import { DateEthiopian } from "./DateEthiopian";

function isLeapYear(year) {
    return (1 + year) % 4 === 0
}


export class DayEthiopian {
    constructor(date = null, lang = "default") {

        //If date is string or any other property convert it to EthiopianCalendar object.
        if (date && !(date instanceof DateEthiopian)) {
            date = new DateEthiopian(date)
        }
        date = (date === null ? new DateEthiopian() : date);
        this.Date = date;
        this.date = date.getDate();
        /**
         * This stores the day name in string format
         */
        this.day = date.toLocaleString(lang, { weekday: 'long' })
        this.dayNumber = date.getDay() + 1
        this.dayShort = date.toLocaleString(lang, { weekday: 'short' })
        this.year = date.getFullYear()
        this.yearShort = Number(date.toLocaleString(lang, { year: "2-digit" }))
        this.month = date.toLocaleString(lang, { month: 'long' })
        this.monthShort = date.toLocaleString(lang, { month: "short" })
        this.monthNumber = Number(date.toLocaleString(lang, { month: '2-digit' }))
    }

    isEqualTo(date) {
        date = date instanceof DateEthiopian ? date : date.Date
        return date.getDate() === this.date &&
            date.getMonth() === this.monthNumber - 1 &&
            date.getFullYear() === this.year;
    }

    toIsoString() {
        return this.format("YYYY-MM-DD")
    }

    format(formatStr) {
        return formatStr
            .replace(/\bYYYY\b/, this.year)
            .replace(/\bYYY\b/, this.yearShort)
            .replace(/\bDDDD\b/, this.day)
            .replace(/\bDDD\b/, this.dayShort)
            .replace(/\bDD\b/, this.date.toString().padStart(2, '0'))
            .replace(/\bD\b/, this.date)
            .replace(/\bMMMM\b/, this.month)
            .replace(/\bMMM\b/, this.monthShort)
            .replace(/\bMM\b/, this.monthNumber.toString().padStart(2, '0'))
            .replace(/\bM\b/, this.monthNumber)
    }
}

class Month {
    constructor(date = null, lang = "default") {
        const day = new DayEthiopian(date, lang);
        const monthsSize = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 5];
        this.lang = lang

        this.name = day.month;
        this.number = day.monthNumber;
        this.year = day.year;
        this.numberOfDays = monthsSize[this.number - 1];

        if (this.number === 13) {
            this.numberOfDays += isLeapYear(day.year) ? 1 : 0
        }

        /**
         * This iterator returns all days in a given month.
         */
        this[Symbol.iterator] = function* () {
            let number = 1
            yield this.getDay(number);
            while (number < this.numberOfDays) {
                ++number;
                yield this.getDay(number)
            }
        }
    }

    getDay(date) {
        return new DayEthiopian(new DateEthiopian(this.year, this.number - 1, date), this.lang)
    }
}

export class CalendarEthiopian {
    weekDays = Array.from({ length: 7 })
    constructor(year = null, monthNumber = null, lang = "default") {

        this.today = new DayEthiopian(null, lang);
        this.year = year ?? this.today.year;
        this.month = new Month(new DateEthiopian(this.year, monthNumber ?? (this.today.monthNumber - 1), 1))
        this.lang = lang;

        this[Symbol.iterator] = function* () {
            let number = 1;

            yield this.getMonth(number)
            while (number < 13) {
                ++number;
                yield this.getMonth(number)
            }
        }

        /**
         * This will fill the weekDays array with the name of the days
         * i.e Mon, tue, wed...
         */
        this.weekDays.forEach((_, i) => {
            let day
            if (this.month.numberOfDays >= (i + 1)) {
                day = this.month.getDay(i + 1);
            }
            else {
                day = this.getNextMonth().getDay(i + 1 - this.month.numberOfDays)
            }

            if (!this.weekDays.includes(day.day)) {
                this.weekDays[day.dayNumber - 1] = day.day
            }


        })
    }

    get isLeapYear() {
        return isLeapYear(this.year)
    }

    getMonth(monthNumber) {
        return new Month(new DateEthiopian(this.year, monthNumber - 1, 1), this.lang)
    }

    getPreviousMonth() {
        if (this.month.number === 1) {
            return new Month(new DateEthiopian(this.year - 1, 12, 1), this.lang)
        }
        //Because Date's month is indexed from 0 we need to subtract 2 from the month number
        return new Month(new DateEthiopian(this.year, this.month.number - 2, 1), this.lang)
    }

    getNextMonth() {
        if (this.month.number === 13) {
            return new Month(new DateEthiopian(this.year + 1, 0, 1), this.lang)
        }
        //Because Date's month is indexed from 0 just sending the month.number is engough
        return new Month(new DateEthiopian(this.year, this.month.number, 1), this.lang)
    }

    goToNextYear() {
        this.year += 1
        this.month = new Month(new DateEthiopian(this.year, 0, 1), this.lang)
    }

    goToPreviousYear() {
        this.year -= 1;
        this.month = new Month(new DateEthiopian(this.year, 12, 1), this.lang);
    }

    goToNextMonth() {
        if (this.month.number === 13) {
            return this.goToNextYear();
        }

        this.month = new Month(new DateEthiopian(this.year, (this.month.number), 1), this.lang);
    }

    goToPreviousMonth() {
        if (this.month.number === 1) {
            return this.goToPreviousYear();
        }

        this.month = new Month(new DateEthiopian(this.year, (this.month.number - 2), 1), this.lang);
    }
}