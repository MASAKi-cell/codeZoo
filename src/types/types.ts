/** ステータス */
export interface CAT_STATUS {
  stage: number // 1:幼少期, 2:成長期, 3:成熟期
  affection: number // 好感度
  energy: number // エネルギー
  satietyLevel: number // 満腹度
  isSick: boolean // 病気
  awake: boolean // 現在の時間（昼/夜）
  create_at: string // 作成日
}

export interface UI_CAT_STATUS extends CAT_STATUS {
  stageName: string
  affectionLevel: string
  imageUrl: string
}
