'use strict'

const jQuery = require('jquery')

function fillSelect (select, options) {
  select.html('<option value="-">-</option>')
  options.forEach(({value, display}) => {
    select.append('<option value="' + value + '">' + display + '</option>')
  })
}

async function request ({requestString, variableValues}) {
  const response = await jQuery.ajax({
    url: '/graphql',
    data: JSON.stringify({
      query: requestString,
      variables: variableValues
    }),
    contentType: 'application/json',
    type: 'POST',
    dataType: 'json'
  }).fail((jqXHR, textStatus, errorThrown) => {
    console.log('Error while calling GraphQL:')
    console.log('jqXHR', jqXHR)
    console.log('textStatus', textStatus)
    console.log('errorThrown', errorThrown)
  })

  return response.data
}

Object.assign(exports, {fillSelect, request})
