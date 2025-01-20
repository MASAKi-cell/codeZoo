/** ステータス */
export type CAT_STATUS = {
  stage: 'kitten' | 'young' | 'adult' // 幼少期, 成長期, 成熟期
  affection: number // 好感度
  energy: number // エネルギー
  satietyLevel: number // 満腹度
  isSick: boolean // 病気
  awake: boolean // 現在の時間（昼/夜）
}
