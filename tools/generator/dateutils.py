import datetime
import unittest


# https://stackoverflow.com/a/38283685/905845
def iso_to_gregorian(iso_year, iso_week, iso_day):
    jan4 = datetime.date(iso_year, 1, 4)
    start = jan4 - datetime.timedelta(days=jan4.isoweekday()-1)
    return start + datetime.timedelta(weeks=iso_week-1, days=iso_day-1)
