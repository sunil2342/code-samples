const start = new Date().getTime()
const yargs = require('yargs')
const chalk = require('chalk')
const axios = require('axios')
const pkg = require('./package.json')

// CLI input...

console.log(`${pkg.name} v${pkg.version} by ${pkg.author}\n${pkg.description}\n`)

const options = yargs
 .usage('Usage: -host <host> -question-type <question-type> -value <value>')
 .option('host', { alias: 'h', describe: 'MonQcle API host', type: 'string', demandOption: true })
 .option('question-type', { alias: 'q', describe: 'Question Type', type: 'string', demandOption: true })
 .option('value', { alias: 'v', describe: 'Value', type: 'string', demandOption: true })
 .argv

// 'options' is now correctly filled...

// Run the query...
query(options)

// Performs a MonQcle query given { host, questionType, value } options...
async function query(options) {
  const { host, questionType, value } = options
  try {
    // Make the request...
    const response = await axios.get(host)
    if (response.status === 200) {
      const { snapshot } = response.data
      const { mappable_data, questions_answers } = snapshot

      // Get a list of matching questions...
      const questions = questions_answers.filter(question => question.type == questionType)
      
      // If there aren't any, let them know about it...
      if (!questions || questions.length <= 0) {
        console.error(`\n%s No questions match the type "${questionType}". Did you type it correctly?`, chalk.red.bold('ERROR:'))
        return process.exit(1)
      }

      // Get a list of question IDs to compare...
      const questionIDs = questions.map((question) => question.id)
      let maxAnswerCount = 0
      let dataIndex = -1

      // Loop through the mappable_data...
      mappable_data.forEach((data, index) => {
        let answerCount = 0
        // Loop through the answers...
        Object.keys(data.answers).forEach((key) => {
          // It's answered if the response is in the array...
          if ( questionIDs.includes(key) &&
            (Array.isArray(data.answers[key])
              ? data.answers[key].includes(value)
              : data.answers[key] === value)
          ) answerCount++
        })
        // Switch the leader if this jurisdiction has the most answers...
        if (answerCount > maxAnswerCount) {
          maxAnswerCount = answerCount
          dataIndex = index
        }
      })

      // Record the time it took...
      const end = new Date().getTime()

      // We're done! Print the results...
      console.log(`%s ${mappable_data[dataIndex].jur_raw.name}`, chalk.yellow('Jurisdiction Name:'))
      console.log(`%s ${maxAnswerCount}`, chalk.yellow('Total:'))
      console.log(`%s ${( end - start ) / 1000} seconds`, chalk.yellow('Took:'))
      console.log(`\n%s`, chalk.green.bold('Done'))
    } else {
      // There was an error making the request to the API (draw it so they can fix it)...
      throw new Error()
    }
  } catch (e) {
    // If we get here they aren't connected to the internet or provided crazy input...
    console.error(`\n%s ${(e.message ? e.message : 'Could not process your request. Please check your input and your Internet connection.')}`, chalk.red.bold('ERROR:'))
    process.exit(1) // Exit code for general errors
  }
}
