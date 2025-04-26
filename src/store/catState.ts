import * as vscode from 'vscode'
/** config */
import { CAT_STATE_KEY } from '../config/constants'

export class catState {
  private globalState: vscode.Memento
  private stateKey: string
  constructor(globalState: vscode.Memento) {
    this.globalState = globalState
    this.stateKey = CAT_STATE_KEY
  }

  /** getter */
  public getCatState<T>(): T | null {
    const stateJson = this.globalState.get<string>(this.stateKey)
    if (stateJson) {
      return JSON.parse(stateJson)
    }
    return null
  }

  /** update */
  public setState<T>(state: T): Thenable<void> {
    return this.globalState.update(this.stateKey, JSON.stringify(state))
  }

  /** delete */
  public clearState(): Thenable<void> {
    return this.globalState.update(this.stateKey, undefined)
  }
}
