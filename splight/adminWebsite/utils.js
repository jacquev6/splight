'use strict'

function fillSelect (select, options) {
  select.html('<option value="-">-</option>')
  options.forEach(({value, display}) => {
    select.append('<option value="' + value + '">' + display + '</option>')
  })
}

Object.assign(exports, {fillSelect})
