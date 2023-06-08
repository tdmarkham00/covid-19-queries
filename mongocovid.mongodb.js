/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('COVID');

R2
db.us_state_vaccinations.aggregate(
    [
        {
            '$group' : {
                '_id' : '$location',
                'total_people_vaccinated' : {'$max' : '$people_fully_vaccinated'}}
        },
        {
            '$out' : 'max_state_vaccinations'
        }
    ]
)

// highest 10 states ordered by deaths divided by cases.
db.covid_counties.aggregate(
    [
        {
            '$group' : {
                '_id' : {'county' : '$county', 'state' : '$state'},
                'max_cases' : {'$max' : '$cases'},
                'max_deaths' : {'$max' : '$deaths'}
            }
        },
        {
            '$group' : {
                '_id' : '$_id.state',
                'sum_max_cases' : {'$sum' : '$max_cases'},
                'sum_max_deaths' : {'$sum' : '$max_deaths'}
            }
        },
        {
            '$project' : {
                '_id' : 1,
                'sum_max_deaths' : 1,
                'sum_max_cases' : 1,
                'death_rate' : {'$divide' : ['$sum_max_deaths', '$sum_max_cases']}
            }
        },
        {
            '$sort' : {
                'death_rate' : 1
            }
        },
        {
            '$lookup' : { 
                'from' : 'max_state_vaccinations',
                'localField' : '_id',
                'foreignField' : '_id',
                'as' : 'state_data'
            } 
        },
        // {
        //     '$limit' : 10
        // },
        {
            '$out' : 'state_data'
        }
    ]
)

// highest 10 ordered by death percent
db.state_data.aggregate(
    [
        {
            '$lookup' : {
                'from' : 'state_pops',
                'localField' : '_id',
                'foreignField' : 'NAME',
                'as' : 'state_pops'
            }
        },
        {
            '$unwind' : '$state_data'
        },
        {
            '$unwind' : '$state_pops'
        },
        {
            '$project' : {
                '_id' : 1,
                'sum_max_deaths' : 1,
                'sum_max_cases' : 1,
                'state_pops.POPESTIMATE2019' : 1,
                'population_not_vaccinated' : {'$subtract' : ['$state_pops.POPESTIMATE2019', '$state_data.total_people_vaccinated']}
            }
        },
        {
            '$project' : {
                'population_not_vaccinated' : 1,
                'death_percent' : {'$divide' : ['$sum_max_deaths', '$population_not_vaccinated']}
            }
        },
        {
            '$sort' : {'death_percent' : -1}
        },
        {
            '$limit' : 10
        }
    ]
)

db.covid_counties.aggregate(
    [
    {
        '$sort' : {'deaths' : -1}
    },
    {
        '$project': {'county' : 1, 'state' : 1, 'deaths' : 1}
    },
    {
        '$limit' : 1
    }
    ]
)

db.covid_counties.aggregate(
    [
        {
            '$sort' : {'cases' : -1}
        },
        {
            '$project': {
                'county' : 1,
                'state' : 1,
                'cases' : 1}
        },
        {
            '$limit' : 1
        }
    ]
)

db.covid_counties.aggregate(
    [
        {
            '$match' : {'county' : 'Utah'}
        },
        {
            '$sort' : {'deaths' : -1}
        },
        {
            '$project': {
                'county' : 1,
                'state' : 1,
                'deaths' : 1}
        },
        {
            '$limit' : 1
        }
    ]
)

db.covid_counties.aggregate(
    [
    {
      $group: {
        _id: {
          county: "$county",
          state: "$state"
        },
        CountyCases: { $max: "$cases" },
        CountyDeaths: { $max: "$deaths" }
      }
    },
    {
      $group: {
        _id: "$_id.state",
        AllCases: { $sum: "$CountyCases" },
        AllDeaths: { $sum: "$CountyDeaths" }
      }
    },
    {
      $project: {
        _id: 0,
        state: "$_id",
        AllCases: 1,
        AllDeaths: 1,
        DeathRate: { $divide: [ "$AllDeaths", "$AllCases" ] }
      }
    },
    {
      $sort: { DeathRate: -1 }
    }
  ]
)
  
db.covid_counties.aggregate(
    [
    {
      $match: {
        state: "Utah"
      }
    },
    {
      $group: {
        _id: "$county",
        CountyDeaths: { $max: "$deaths" }
      }
    },
    {
      $project: {
        _id: 0,
        county: "$_id",
        CountyDeaths: 1
      }
    },
    {
      $sort: { CountyDeaths: -1 }
    }
  ]
)
  