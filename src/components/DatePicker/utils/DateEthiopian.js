import { ethiopian } from "./ConstantEthoipian";

/**
 * This is the gregorian Epoch of Jan 1, 0001
 */
const GREGORIAN_EPOCH = 1721425.5

/**
 * This is the Ethiopian epoch of Meskerem 1,0001
 */
const ETHIOPIAN_EPOCH = 1724220.5



/**
 * This is a js class that functions like the default Date element in js.
 * This class will be used to convert to Ethiopian dates and support basic features that
 * default javascript Date class suports.
 */
export class DateEthiopian {

    /**
     * This instantiates a DateEthiopian object with given paramets.
     * If no parameters are provided it instantiates the date to today.
     * 
     * @param {number | string| dateObject} year a numeric year value if second and third arguments are provided, otherwise a date string or a date object
     * @param {number} month a numberic month value 
     * @param {number} day a numeric date value
     */
    constructor(year, month, day) {
        
        if (arguments.length === 0) {
            return DateEthiopian.fromIso(new Date())
        } else if (arguments.length === 1) {
            if (typeof year === "string") {
                return DateEthiopian.parse(year);
            } else if (typeof year === "object" && year instanceof Date) {
                return DateEthiopian.fromIso(year.getFullYear(), year.getMonth(), year.getDate())
            } else {
                throw new Error("Invalid Argument Exception");
            }
        } else if (arguments.length === 3) {

            DateEthiopian.validate(parseInt(year), parseInt(month), parseInt(day))

            this.year = parseInt(year, 10)
            this.month = parseInt(month, 10)
            this.date = parseInt(day, 10)
        } else {
            throw new Error("Invalid Argument Exception");
        }

    }

    /**
     * 
     * @param {number} year The year to check if leap year is or not
     * @returns True if year provided is leap year or false otherwise
     */
    static isEthiopianLeapYear(year) {

        return (year+1) % 4 === 0
    }

    /**
     * This function checks if the given date is a valid date and throws an error if not
     * @param {number} year 
     * @param {number} month 
     * @param {number} day 
     */
    static validate(year, month, day) {

        if (!(year >= 1)) {
            throw new Error("Calendar validation error: Invalid year " + year)
        }
        if (!(month >= 0 && month < ethiopian.monthCount)) {
            throw new Error("Calendar validation error: Invalid month " + month)
        }
        const daysInLeapYearMonth = this.isEthiopianLeapYear(year) ? 6 : 5

        if (month === ethiopian.monthCount - 1 && day > daysInLeapYearMonth) {
            throw new Error("Calendar validation error: Invalid day " + day + " for month " + (month + 1))
        }

        if (!(day > 0 && day <= 30)) {
            throw new Error("Calendar validation error: Invalid day " + day)
        }

    }

    /**
     * This function parses a given string to DateEthiopian.
     * Note that the string is considered to be in Ethiopian calendar.
     * 
     * @param {string} dateString a date string to parse
     * @param {string} pattern a parsing pattern, yyyy-mm-dd is the default for now.
     * @returns DateEthiopian object
     */
    static parse(dateString, pattern = "yyyy-mm-dd") {
        if (!dateString) {
            throw new Error(`Parsing error: dateString is empty`)
        }
        if (pattern !== "yyyy-mm-dd") {
            throw new Error(`Not implemented Exception: Provided parse pattern is not implemented.`)
        }
        const _date = dateString.split("-")
        if (_date.length !== 3) {
            throw new Error(`Parsing error: Can't parse ${dateString}`)
        }

        //If it reaches here then everything is ok.
        let y = parseInt(_date[0])
        let m = parseInt(_date[1]) -1
        let d = parseInt(_date[2])
        return new DateEthiopian(y, m, d)
    }

    /**
     * This function a converts Ethiopian date to ISO date.
     * 
     * @param {number | string| dateObject} year a numeric year value if second and third arguments are provided, otherwise a date string or a DateEthiopian object
     * @param {number} month a numberic month value in Ethiopian calendar
     * @param {number} date a numeric date value in Ethiopian calendar
     * @returns a Date object in gregorian format
     */
    static ethiopianToIso(year, month, date) {
        let _date;
        if (arguments.length === 1) {
            if (typeof year === "string") {
                _date = this.dateAsArrayString(new DateEthiopian(year));

            } else if (typeof year === "object" && year instanceof DateEthiopian) {
                _date = this.dateAsArrayString(year)
            } else {
                throw new Error("Invalid argument exception")
            }
        } else if (arguments.length === 3) {
            _date = [year, month, date]
        } else {
            throw new Error("Invalid argument exception")
        }

        let jdn = this.ethiopianToJDN(_date[0], _date[1], _date[2])

        return this.gregorianFromJDN(jdn)
    }

    /**
     * converts ISO / Gregorian date to Ethiopian date.
     * @param {number | string | object} year A numeric value if second and third arguments are given, otherwise a string or a Date object
     * @param {*} month a numberic month value in gregorian
     * @param {*} day a numberic date value in gregorian
     */
    static fromIso(year, month, day) {
        let _date;
        if (arguments.length === 1) {
            if (typeof year === "string") {
                _date = DateEthiopian.dateAsArrayString(new Date(year), true);
            } else if (typeof year === "object" && year instanceof Date) {
                _date = DateEthiopian.dateAsArrayString(year, true)
            } else {
                throw new Error("Invalid argument exception")
            }
        } else if (arguments.length === 3) {
            _date = [year, month + 1, day];
        } else {
            throw new Error("Invalid argument exception")
        }

        let jdn = DateEthiopian.gregorianToJDN(_date[0], _date[1], _date[2])

        return DateEthiopian.ethiopianFromJDN(jdn)
    }

    /**
     * This function converts a given JDN number to it's equivalent Ethiopian date.
     * This is the heart of the conversion where a gregorian is first converted to 
     * JDN and then the JDN is converted to Ethiopian.
     * 
     * @param {number} jdn the Gregorian JDN in number
     * @returns DateEthiopian object in Ethiopian calendar
     */
    static ethiopianFromJDN(jdn) {
        const year = Math.floor((4 * (jdn - ETHIOPIAN_EPOCH) + 1463) / 1461)
        const month = Math.floor((jdn - DateEthiopian.ethiopianToJDN(year, 0, 1)) / 30);
        const day = jdn + 1 - DateEthiopian.ethiopianToJDN(year, month, 1);

        return new DateEthiopian(year, month, day)
    }

    /**
     * 
     * 
     * @param {number} year Ethiopian year in number
     * @param {number} month Ethiopian month in number
     * @param {number} day Ethiopian day in number
     * @returns 
     */
    static ethiopianToJDN(year, month, day) {
        this.validate(year, month, day)
        return day + ((month) * 30) + ((year - 1) * 365) + Math.floor(year / 4) + ETHIOPIAN_EPOCH - 1
    }


    /**
     * 
     * @param {number} year Gregorian year
     * @returns Boolean true if it is a leap year and false if not
     */
    static isGregorianLeapYear(year) {
        return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
    }


    /**
     * This function returns the gregorian year for a given jdn number
     * @param {number} jdn te jdn number to calculate the year from
     * @returns a number of the year for the given jdn
     */
    static jdnToGregorianYear(jdn) {
        const jd0 = Math.floor(jdn - 0.5) + 0.5
        const depoch = jd0 - GREGORIAN_EPOCH
        const quadricent = Math.floor(depoch / 146097)
        const dqc = depoch % 146097
        const cent = Math.floor(dqc / 36524)
        const dcent = dqc % 36524
        const quad = Math.floor(dcent / 1461)
        const dquad = dcent % 1461
        const yindex = Math.floor(dquad / 365)

        return quadricent * 400 + cent * 100 + quad * 4 + yindex + ((cent !== 4 && yindex !== 4) ? 1 : 0)
    }

    /**
     * This function converts a jdn date to a Date object in Gregorian format
     * 
     * @param {number} jdn the jdn number to create a Date object from
     * @returns a Date object where the jdn is converted to Gregorian
     */
    static gregorianFromJDN(jdn) {
        const jd0 = Math.floor(jdn - 0.5) + 0.5;
        const year = this.jdnToGregorianYear(jd0)
        const yearDate = jd0 - this.gregorianToJDN(year, 1, 1)
        const leapAdj = jd0 < this.gregorianToJDN(year, 3, 1) ? 0 : this.isGregorianLeapYear(year) ? 1 : 2;
        const month = Math.floor(((yearDate + leapAdj) * 12 + 373) / 367);
        const date = jd0 - this.gregorianToJDN(year, month, 1) + 1;

        let _date = new Date();

        _date.setFullYear(year)
        _date.setMonth(month - 1)
        _date.setDate(date)

        return _date
    }

    /**
     * This function converts a gregorian date expressed in (y,m,d) to 
     * Julian date number starting from the EPOCH.
     * @param {number} year Gregorian year in number
     * @param {number} month Gregorian month in number
     * @param {number} day Gregorian day in number
     * @returns The Julian Date Number value
     */
    static gregorianToJDN(year, month, day) {
        const y1 = year - 1 //because it is zero based


        return GREGORIAN_EPOCH - 1 + //Because it starts from Jan 1 we need to subtract 1
            365 * y1 + //Calculates all dates in year
            Math.floor(y1 / 4) - //Adds the leap year dates
            Math.floor(y1 / 100) + //subtracts the 100 year divisible non leap years
            Math.floor(y1 / 400) + //adds back the 400 year leap dates which were removed because of the 100 
            Math.floor((367 * month - 362) / 12) + (month <= 2 ? 0 : DateEthiopian.isGregorianLeapYear(year) ? -1 : -2) +  //This gives the number of days in the previous months
            day //Day is just normal addition. Since we subtracted 1 previously we just need to add it now.

    }

    /**
     * 
     * @param {Date} date a date object to return an array of
     * @param {boolean} zeroMonthCount True if the month starts with zero or false if it doesn't
     * @returns an array that contains [year, month, day]
     */
    static dateAsArrayString(date, zeroMonthCount = false) {
        return [date.getFullYear(), !zeroMonthCount ? date.getMonth() : date.getMonth() + 1, date.getDate()];
    }

    /**
     * 
     * @returns returns the date of the month
     */
    getDate() {
        return this.date
    }

    /**
     * 
     * @returns returns the day of the week result is between 1-7
     */
    getDay() {
        let _date = DateEthiopian.ethiopianToIso(this.year, this.month, this.date)
        //_date is the default js Date object.
        return _date.getDay()
    }

    /**
     * 
     * @returns returns the year in number
     */
    getFullYear() {
        return this.year
    }

    /**
     * 
     * @returns return the month in number
     */
    getMonth() {
        return this.month
    }

    /**
     * Returns the iso form of the date.
     * @returns The iso string of the date in the form YYYY-MM-DD
     */
    toISOString(){
        return `${this.getFullYear().toString()}-${(this.getMonth() + 1)
            .toString()
            .padStart(2, 0)}-${this.getDate().toString().padStart(2, 0)}`
    }

    /**
     * 
     * @param {string} lang language: for now is default
     * @param {object} obj an object containing how the string should be returned
     * @returns a string in a formatted manner
     */
    toLocaleString(lang = "default", obj) {
        if (!obj) {
            return this.month + "/" + this.date + "/" + this.year
        }
        if (obj.weekday === "long") {
            return ethiopian.dayNames[this.getDay()]
        }
        if (obj.weekday === "short") {
            return ethiopian.dayNamesMin[this.getDay()]
        }

        if (obj.year === "long") {
            return this.year
        }

        if (obj.year === "2-digit") {
            return ("" + this.year).slice(-2)
        }

        if (obj.month === "long") {
            return ethiopian.monthNames[this.month]
        }


        if (obj.month === "short") {
            return ethiopian.monthNamesShort[this.month]
        }

        if (obj.month === "2-digit") {
            return ("0" + (this.month + 1)).slice(-2);
        }

        //If it reaches here then it means that the format is not supported yet
        throw new Error("Parsing format not supported", obj)
    }


}