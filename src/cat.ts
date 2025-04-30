import { CAT_STATUS } from './config/constants'
import { CatState } from './store/catState'
import { cat_status, cat_status_ui } from './types/cat_type'

export class Cat {
  private state: cat_status
  private stateManager: CatState
  private defaultState: cat_status = {
    stage: 0,
    affection: 0,
    energy: 100,
    satietyLevel: 100,
    isSleeping: false,
    lastInteraction: new Date().toISOString(),
    create_at: new Date().toISOString()
  }

  constructor(stateManager: CatState) {
    this.stateManager = stateManager
    const savedState = this.stateManager.getCatState<cat_status>()
    this.state = savedState ? { ...this.defaultState, ...savedState } : this.defaultState
  }

  private applyTimeBasedChanges(): void {
    const now = new Date()
    const lastInteraction = new Date(this.state.lastInteraction)
    const hoursPassed = (now.getTime() - lastInteraction.getTime()) / (1000 * 60 * 60)

    // 時間経過によるエネルギーと満腹度の減少
    if (hoursPassed > 0) {
      this.state.energy = Math.max(0, this.state.energy - hoursPassed * 5)
      this.state.satietyLevel = Math.max(0, this.state.satietyLevel - hoursPassed * 10)
      this.state.lastInteraction = now.toISOString()
      this.saveState()
    }

    // 成長段階の更新
    const daysSinceCreation =
      (now.getTime() - new Date(this.state.create_at).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceCreation >= 14 && this.state.stage < CAT_STATUS.GROWTH) {
      this.state.stage = CAT_STATUS.GROWTH // 2週間後に成猫に
      this.saveState()
    } else if (daysSinceCreation >= 7 && this.state.stage < CAT_STATUS.YOUNG) {
      this.state.stage = CAT_STATUS.YOUNG // 1週間後に成長途中に
      this.saveState()
    }
  }

  private decreaseAffection(amount: number): void {
    this.state.affection = Math.max(0, this.state.affection - amount)
    this.saveState()
  }

  private saveState(): void {
    this.stateManager.setState<cat_status>(this.state)
  }

  private getStageName(): string {
    const stageNames = ['子猫', '若猫', '成猫']
    return stageNames[this.state.stage]
  }

  private getAffectionLevel(): string {
    if (this.state.affection >= 80) return 'とても懐いている'
    if (this.state.affection >= 50) return '懐いている'
    if (this.state.affection >= 20) return '少し懐いている'
    return '懐いていない'
  }

  private getCatImageUrl(): string {
    if (this.state.isSleeping) {
      return 'cat-sleep.png'
    }

    const stageImages = ['cat-baby.png', 'cat-teen.png', 'cat-adult.png']
    return stageImages[this.state.stage]
  }

  public updateTimeState(isNight: boolean): boolean {
    if (isNight && !this.state.isSleeping) {
      this.state.isSleeping = true
      this.saveState()
      return true // 状態が変化
    } else if (!isNight && this.state.isSleeping) {
      this.state.isSleeping = false
      this.saveState()
      return true // 状態が変化
    }
    return false // 状態に変化なし
  }

  public wakeUp(): boolean {
    if (this.state.isSleeping) {
      this.state.isSleeping = false
      this.decreaseAffection(10) // 夜に起こすと好感度が下がる
      this.saveState()
      return true
    }
    return false
  }

  public feedCat(amount: number = 10): boolean {
    if (this.state.isSleeping) {
      return false // 寝ている間は餌をあげられない
    }

    this.state.satietyLevel = Math.min(100, this.state.satietyLevel + amount)
    this.increaseAffection(2) // 餌をあげると少し好感度が上がる
    this.state.lastInteraction = new Date().toISOString()
    this.saveState()
    return true
  }

  public playCat(amount: number = 15): boolean {
    if (this.state.isSleeping || this.state.energy < 10) {
      return false // 寝ている間や疲れている時は遊べない
    }

    this.state.energy = Math.max(0, this.state.energy - amount)
    this.increaseAffection(5) // 遊ぶと好感度が上がる
    this.state.satietyLevel = Math.max(0, this.state.satietyLevel - amount / 3) // 遊ぶとお腹が空く
    this.state.lastInteraction = new Date().toISOString()
    this.saveState()
    return true
  }

  public increaseAffection(amount: number): void {
    this.state.affection = Math.min(100, this.state.affection + amount)

    // 好感度に応じたメッセージやイベントをここに追加可能
    this.saveState()
  }

  public getState(): cat_status_ui {
    return {
      ...this.state,
      // UIに表示するための追加プロパティ
      stageName: this.getStageName(),
      affectionLevel: this.getAffectionLevel(),
      imageUrl: this.getCatImageUrl()
    }
  }
}
