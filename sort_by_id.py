#!/usr/bin/env python3

import json
import sys

json.dump(sorted(json.load(sys.stdin), key=lambda d: d["_id"]), sys.stdout, sort_keys=True, indent=4)
sys.stdout.write("\n")
