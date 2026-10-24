export type Subject = '数学' | '语文' | '英语';
export type Status = '待加强' | '练习中' | '已掌握';
export type Mistake = { id: string; title: string; subject: Subject; topic: string; question: string; answer: string; explanation: string; status: Status; createdAt: string; imageUri?: string; sourceImageUri?: string; demo?: boolean; grade?: string };
export type Profile = { displayName: string; grade: string; subject: Subject; dailyGoal: number; reminderEnabled: boolean; reminderTime: string };
export type SavedState = { version: 1; mistakes: Mistake[]; profile: Profile; completed: string[]; reviewDay?: string };
export function localDay(date = new Date()) { return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`; }
export function rollReviewDay(state: SavedState, day = localDay()): SavedState { return state.reviewDay === day ? state : {...state, reviewDay: day, completed: []}; }
export function activeMistakes(state: SavedState) { return state.mistakes.filter(m => (m.grade ?? '四年级') === state.profile.grade && m.subject === state.profile.subject); }
export const initialState: SavedState = {
  version: 1, profile: { displayName: '小麦同学', grade: '四年级', subject: '数学', dailyGoal: 5, reminderEnabled: true, reminderTime: '18:00' }, completed: [],
  mistakes: [
    { id: 'demo-1', title: '分数应用题', subject: '数学', topic: '分数应用题', question: '一盒彩笔有 24 支，小麦用了其中的四分之一，还剩多少支？', answer: '18', explanation: '用掉：24 ÷ 4 = 6（支），剩下：24 − 6 = 18（支）。', status: '待加强', createdAt: '2026-10-19T06:20:00Z', demo: true },
    { id: 'demo-2', title: '几何面积', subject: '数学', topic: '图形与几何', question: '一个长方形长 12 厘米，宽 8 厘米，面积是多少平方厘米？', answer: '96', explanation: '长方形面积 = 长 × 宽 = 12 × 8 = 96（平方厘米）。', status: '练习中', createdAt: '2026-10-18T11:10:00Z', demo: true },
    { id: 'demo-3', title: '单位换算', subject: '数学', topic: '单位换算', question: '3 米 20 厘米等于多少厘米？', answer: '320', explanation: '1 米 = 100 厘米，所以 300 + 20 = 320（厘米）。', status: '已掌握', createdAt: '2026-10-12T03:00:00Z', demo: true },
    { id: 'demo-4', title: '平均分的问题', subject: '数学', topic: '分数应用题', question: '把 36 本书平均放在 4 个书架上，每个书架放多少本？', answer: '9', explanation: '平均分用除法：36 ÷ 4 = 9（本）。', status: '待加强', createdAt: '2026-10-11T03:00:00Z', demo: true },
    { id: 'demo-5', title: '正方形面积', subject: '数学', topic: '图形与几何', question: '一个正方形的边长是 6 厘米，面积是多少平方厘米？', answer: '36', explanation: '正方形面积 = 边长 × 边长 = 6 × 6 = 36（平方厘米）。', status: '待加强', createdAt: '2026-10-10T03:00:00Z', demo: true },
    { id: 'demo-6', title: '长度单位换算', subject: '数学', topic: '单位换算', question: '2 米 35 厘米等于多少厘米？', answer: '235', explanation: '1 米 = 100 厘米，所以 200 + 35 = 235（厘米）。', status: '待加强', createdAt: '2026-10-09T03:00:00Z', demo: true },
  ],
};
export function practiceQueue(mistakes: Mistake[], subject: Subject, completed: string[], limit = 5) {
  return mistakes.filter(m => m.subject === subject && m.status !== '已掌握' && !completed.includes(m.id)).slice(0, Math.max(0, limit));
}
export function summary(mistakes: Mistake[], subject: Subject) {
  const items = mistakes.filter(m => m.subject === subject);
  const groups = new Map<string, { topic: string; count: number; weak: number }>();
  for (const m of items) { const group = groups.get(m.topic) ?? { topic: m.topic, count: 0, weak: 0 }; group.count++; if (m.status !== '已掌握') group.weak++; groups.set(m.topic, group); }
  return { total: items.length, mastered: items.filter(m => m.status === '已掌握').length, topics: [...groups.values()].sort((a, b) => b.weak - a.weak) };
}
export function parseSavedState(raw: string): SavedState {
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== 'object') throw new Error('数据格式无效');
  const s = value as SavedState;
  if (s.version !== 1 || !Array.isArray(s.mistakes) || !Array.isArray(s.completed) || s.completed.some(x => typeof x !== 'string') || !s.profile || !['一年级','二年级','三年级','四年级','五年级','六年级'].includes(s.profile.grade) || !['数学','语文','英语'].includes(s.profile.subject)) throw new Error('数据格式无效');
  const profile = s.profile as Profile;
  if ((profile.displayName !== undefined && typeof profile.displayName !== 'string') || (profile.dailyGoal !== undefined && (!Number.isInteger(profile.dailyGoal) || profile.dailyGoal < 1 || profile.dailyGoal > 20)) || (profile.reminderEnabled !== undefined && typeof profile.reminderEnabled !== 'boolean') || (profile.reminderTime !== undefined && !/^([01]\d|2[0-3]):[0-5]\d$/.test(profile.reminderTime))) throw new Error('个人设置无效');
  if (s.mistakes.some(m => !m || ['id','title','topic','question','answer','explanation','createdAt'].some(k => typeof m[k as keyof Mistake] !== 'string') || !['数学','语文','英语'].includes(m.subject) || !['待加强','练习中','已掌握'].includes(m.status) || (m.imageUri !== undefined && typeof m.imageUri !== 'string') || (m.sourceImageUri !== undefined && typeof m.sourceImageUri !== 'string'))) throw new Error('错题数据无效');
  // Older local records predate profile preferences; add safe defaults without changing their study data.
  return { ...s, profile: { ...profile, displayName: profile.displayName ?? '小麦同学', dailyGoal: profile.dailyGoal ?? 5, reminderEnabled: profile.reminderEnabled ?? true, reminderTime: profile.reminderTime ?? '18:00' } };
}
export function escapeHtml(text: string) { return text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!)); }
export function paperHtml(items: Mistake[], answers = false) {
  return `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><style>body{font-family: sans-serif;padding:32px;color:#142846}h1{text-align:center}article{break-inside:avoid;margin:30px 0}p{line-height:1.8}.space{height:90px;border-bottom:1px dashed #ccc}</style><h1>麦森错题本 · 专属练习</h1><p>姓名：____________　日期：____________</p>${items.map((m,i) => `<article><h3>${i+1}. ${escapeHtml(m.title)}</h3><p>${escapeHtml(m.question)}</p>${answers ? `<p>参考答案：${escapeHtml(m.answer || '请结合原题核对')}</p><p>${escapeHtml(m.explanation)}</p>` : '<div class="space"></div>'}</article>`).join('')}</html>`;
}
