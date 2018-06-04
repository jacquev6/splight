import datetime
import unittest


def previous_week_day(date, weekday):
    while date.weekday() != weekday:
        date -= datetime.timedelta(days=1)
    return date


class PreviousWeekDayTestCase(unittest.TestCase):
    def test_previous_monday_on_monday(self):
        self.assertEqual(previous_week_day(datetime.date(2018, 5, 28), 0), datetime.date(2018, 5, 28))

    def test_previous_wednesday_on_wednesday(self):
        self.assertEqual(previous_week_day(datetime.date(2018, 5, 30), 2), datetime.date(2018, 5, 30))

    def test_previous_wednesday_on_thursday(self):
        self.assertEqual(previous_week_day(datetime.date(2018, 5, 31), 2), datetime.date(2018, 5, 30))

    def test_previous_wednesday_on_tuesday(self):
        self.assertEqual(previous_week_day(datetime.date(2018, 5, 29), 2), datetime.date(2018, 5, 23))


# https://stackoverflow.com/a/38283685/905845
def iso_to_gregorian(iso_year, iso_week, iso_day):
    jan4 = datetime.date(iso_year, 1, 4)
    start = jan4 - datetime.timedelta(days=jan4.isoweekday() - 1)
    return start + datetime.timedelta(weeks=iso_week - 1, days=iso_day - 1)
