import {Args, Command, Flags,ux} from '@oclif/core'
import {createInquirer,getData} from "../../prompts/ecom.js"


export default class PromptExecute extends Command {
  static description = 'Run this command to enter an interactive e-commerce CLI'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: Flags.boolean({char: 'f'}),
  }

  static args = {
    // file: Args.string({description: 'file to read'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(PromptExecute)
    this.log("E-commerce application")
    // ux.action.start('starting a process')
    let prod = await getData('https://api.storerestapi.com/products/')
    // ux.action.stop()
   
    createInquirer(prod);
    
  }
}
