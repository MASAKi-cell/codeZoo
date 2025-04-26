/** ステータス */
export interface CAT_STATUS {
  stage: number // 幼少期, 成長期, 成熟期
  affection: number // 好感度
  energy: number // エネルギー
  satietyLevel: number // 満腹度
  isSick: boolean // 病気
  awake: boolean // 現在の時間（昼/夜）
  create_at: string // 作成日
}
