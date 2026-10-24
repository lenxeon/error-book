import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initialState, summary, practiceQueue, parseSavedState, paperHtml, rollReviewDay, activeMistakes } from './model';
test('练习排除已掌握、其他学科和今天已复习的题',()=>{
  assert.deepEqual(practiceQueue(initialState.mistakes,'数学',['demo-1']).map(m=>m.id),['demo-2','demo-4','demo-5','demo-6']);
  assert.equal(practiceQueue(initialState.mistakes,'语文',[]).length,0);
  assert.deepEqual(practiceQueue(initialState.mistakes,'数学',[],2).map(m=>m.id),['demo-1','demo-2']);
});
test('统计跟随真实的掌握状态',()=>{
  const stats=summary(initialState.mistakes,'数学');assert.equal(stats.total,6);assert.equal(stats.mastered,1);assert.equal(stats.topics.find(t=>t.topic==='单位换算')?.weak,1);
});
test('拒绝损坏的本地数据，防止静默覆盖',()=>{
  assert.throws(()=>parseSavedState('{broken'));assert.throws(()=>parseSavedState(JSON.stringify({...initialState,mistakes:[{id:1}]})));assert.deepEqual(parseSavedState(JSON.stringify(initialState)),initialState);
});
test('为已有本机资料补上练习偏好默认值',()=>{
  const old={...initialState,profile:{grade:'四年级',subject:'数学' as const}};
  assert.deepEqual(parseSavedState(JSON.stringify(old)).profile,{grade:'四年级',subject:'数学',displayName:'小麦同学',dailyGoal:5,reminderEnabled:true,reminderTime:'18:00'});
});
test('试卷转义导入内容，答案只在选中时导出',()=>{
  const m={...initialState.mistakes[0],question:'<script>alert(1)</script>',answer:'18'};
  const html=paperHtml([m]);assert(!html.includes('<script>'));assert(html.includes('&lt;script&gt;'));assert(!html.includes('参考答案：18'));assert(paperHtml([m],true).includes('参考答案：18'));
});
test('第二天未掌握题重新进入复习队列，同一天保留进度',()=>{
  const state={...initialState,reviewDay:'2026-10-19',completed:['demo-1']};
  assert.equal(rollReviewDay(state,'2026-10-19'),state);
  assert.deepEqual(rollReviewDay(state,'2026-10-20').completed,[]);
});
test('不同年级和学科的错题互不混合',()=>{
  assert.equal(activeMistakes(initialState).length,6);
  assert.equal(activeMistakes({...initialState,profile:{...initialState.profile,grade:'一年级'}}).length,0);
  assert.equal(activeMistakes({...initialState,profile:{...initialState.profile,subject:'语文'}}).length,0);
});
