/** config */
import { CAT_STATUS } from '../config/constants'

/** ステータス */
export interface cat_status {
  stage: (typeof CAT_STATUS)[keyof typeof CAT_STATUS] // 1:幼少期, 2:成長期, 3:成熟期
  affection: number // 好感度
  satietyLevel: number // ステータスレベル
  isSleeping: boolean // 寝ているかどうか
  lastInteraction: string // 最後の交流
  create_at: string // 作成日
}

export interface cat_status_ui extends cat_status {
  stageName: string
  affectionLevel: string
  imageUrl: string
}
