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
