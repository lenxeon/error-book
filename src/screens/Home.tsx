import React from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DesignArt } from '../components/DesignArt';
import { Icon } from '../components/Icon';
import { colors, shadow } from '../theme';
import { SavedState, practiceQueue, summary, activeMistakes } from '../data/model';

export type Destination = 'capture' | 'import' | 'notebook' | 'paper' | 'practice' | 'analysis' | 'profile' | 'notifications';

const paperArt = ['paper1', 'paper2', 'paper3'] as const;

export function Home({ state, open, select, detail }: { state: SavedState; open: (d: Destination) => void; select: () => void; detail: (id: string) => void }) {
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, 500);
  const bodyWidth = contentWidth - 28;
  const tileWidth = (bodyWidth - 20 - 21) / 4;
  const items = activeMistakes(state);
  const queue = practiceQueue(items, state.profile.subject, state.completed, state.profile.dailyGoal);
  const recent = items.slice(0, 3);
  const stats = summary(items, state.profile.subject);
  const weak = stats.topics.filter(t => t.weak > 0).length;
  const analysisRows = stats.topics.slice(0, 3).map((t, i) => ({label: t.topic, count: t.count, color: i === 0 ? ['#ff594b', '#ff9b38'] as const : ['#1595ff', '#36c9ff'] as const}));
  const topHeight = contentWidth * (2 / 3);
  const taskHeight = bodyWidth / 3.55;
  const taskAction = !stats.total ? '收录错题，开启学习' : queue.length ? '开始学习' : '查看学习成果';

  return (
    <ScrollView testID="home-scroll" style={s.screen} showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
      <ImageBackground testID="unified-home-top" source={require('../../assets/images/home-top-unified-v2.png')} resizeMode="cover" style={[s.topArtwork,{width:contentWidth,height:topHeight}]}>
      <View style={[s.header,{height:contentWidth*.2}]}>
        <View style={s.brandBlock}>
          <Text style={s.brand}>麦森错题本</Text>
          <View style={s.taglineRow}>
            <Text style={s.tagline}>让每一道错题，成为进步</Text>
          </View>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="切换年级和学科" onPress={select} style={({ pressed }) => [s.profile, pressed && s.pressed]}>
          <DesignArt name="avatar" width={42} style={s.avatar} />
          <View style={s.gradePill}>
            <Text style={s.grade}>{state.profile.grade}</Text>
            <Text style={s.gradeCaret}>▾</Text>
          </View>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="消息提醒" onPress={() => open('notifications')} style={({ pressed }) => [s.bell, pressed && s.pressed]}>
          <Icon name="bell" size={27} />
          <View style={s.dot} />
        </Pressable>
      </View>

      <Pressable accessibilityRole="button" accessibilityLabel="每天进步一点点，好方法，让学习更轻松" onPress={() => open('practice')} style={({ pressed }) => [s.hero, pressed && s.pressed]}>
      </Pressable>
      </ImageBackground>

      <View style={s.body}>
        <View style={s.features}>
          {([
            ['camera', '拍照收录', '试卷/作业', 'capture'],
            ['robot', '豆包导入', '一句话收录', 'import'],
            ['notebook', '我的错题本', '分类管理', 'notebook'],
            ['printer', '智能组卷', '专属练习', 'paper'],
          ] as const).map(([art, title, caption, destination]) => (
            <Pressable key={art} accessibilityRole="button" accessibilityLabel={`${title}，${caption}`} onPress={() => open(destination)} style={({ pressed }) => [s.feature, { width: tileWidth, backgroundColor: {camera:'#e6f8ff',robot:'#f2ecff',notebook:'#fff5df',printer:'#e9faed'}[art] }, pressed && s.pressed]}>
              <DesignArt name={art} width={tileWidth} />
              <Text maxFontSizeMultiplier={1.35} numberOfLines={2} style={s.featureTitle}>{title}</Text>
              <Text maxFontSizeMultiplier={1.2} numberOfLines={2} style={s.featureCaption}>{caption}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable testID="daily-task-card" accessibilityRole="button" accessibilityLabel={`今日学习任务，根据你的错题，推荐专属练习，共${queue.length}题，${taskAction}`} onPress={() => open(stats.total?'practice':'capture')} style={({pressed})=>[s.task,{height:taskHeight},pressed&&s.pressed]}>
          <Image accessible={false} source={require('../../assets/images/task-whole-v2.png')} resizeMode="cover" style={{width:bodyWidth,height:taskHeight}} />
          <View style={s.countBadge} pointerEvents="none"><Text style={s.countText}>{queue.length} 题</Text></View>
        </Pressable>

        <Pressable accessibilityRole="button" accessibilityLabel="查看本周学情分析" onPress={() => open('analysis')} style={({ pressed }) => [s.analytics, pressed && s.pressed]}>
          <View style={s.analysisHeading}>
            <Icon name="chart" size={21} color={colors.red} />
            <Text style={s.sectionTitle}>本周学情分析</Text>
            <View style={s.weakBadge}><Text style={s.weakText}>{!stats.total?'等待收录第一道错题':weak?`有 ${weak} 个薄弱点需要加强`:'所有知识点都已掌握'}</Text></View>
          </View>
          <View style={s.analysisBody}>
            <View style={s.bars}>
              {analysisRows.map((row, index) => (
                <View key={row.label} style={s.barRow}>
                  <Text style={s.barLabel}>{row.label}</Text>
                  <View style={s.barTrack}>
                    <LinearGradient colors={row.color} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.barFill, { width: `${row.count/Math.max(...analysisRows.map(r=>r.count))*100}%` }]} />
                  </View>
                  <Text style={s.barCount}>{row.count} 道</Text>
                </View>
              ))}
              {!stats.total&&<Text style={s.emptyText}>收录错题，发现进步方向</Text>}
            </View>
            <DesignArt name="fox" width={94} style={s.fox} />
            <DesignArt name="bulb" width={28} style={{position:'absolute',right:6,top:1}} />
          </View>
        </Pressable>

        <View style={s.recentHeading}>
          <Icon name="folder" size={19} color="#ffb322" />
          <Text style={s.sectionTitle}>最近收录的错题</Text>
          <Pressable accessibilityRole="button" onPress={() => open('notebook')} style={({ pressed }) => [s.more, pressed && s.pressed]}>
            <Text style={s.moreText}>更多</Text><Icon name="arrow" size={15} />
          </Pressable>
        </View>

        <View style={s.recentGrid}>
          {recent.length ? recent.map((mistake, index) => (
            <Pressable key={mistake.id} accessibilityRole="button" accessibilityLabel={`查看${mistake.title}，${mistake.status}`} onPress={() => detail(mistake.id)} style={({ pressed }) => [s.recentCard, pressed && s.pressed]}>
              {mistake.imageUri
                ? <ImageBackground source={{ uri: mistake.imageUri }} style={s.paperPreview} />
                : mistake.demo ? <DesignArt name={paperArt[index]} width={(bodyWidth - 20) / 3} height={52} /> : <View style={[s.paperPreview,{padding:8,backgroundColor:'#edf4fa'}]}><Text numberOfLines={3} style={{fontSize:9,lineHeight:14,color:colors.muted}}>{mistake.question}</Text></View>}
              <View style={s.recentInfo}>
                <Text numberOfLines={1} style={s.recentTitle}>{mistake.title}</Text>
                <View style={s.recentMeta}>
                  <Text numberOfLines={1} style={s.recentDate}>{mistake.demo?'示例 · ':''}{new Date(mistake.createdAt).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}</Text>
                  <View style={[s.status, { backgroundColor: mistake.status === '已掌握' ? '#d9f8ed' : mistake.status === '练习中' ? '#fff2c6' : '#ffe4e4' }]}>
                    <Text style={[s.statusText, { color: mistake.status === '已掌握' ? '#00805f' : mistake.status === '练习中' ? '#855700' : '#bb3636' }]}>{mistake.status}</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          )) : <Text style={s.emptyText}>还没有{state.profile.subject}错题，拍一张收录吧。</Text>}
        </View>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 18 },
  topArtwork: { overflow:'hidden' },
  header: { paddingHorizontal: 17, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandBlock: { flex: 1, minWidth: 0 },
  brand: { fontSize: 22, lineHeight: 27, fontWeight: '900', color: colors.greenDark, letterSpacing: 1 },
  taglineRow: { minHeight: 24, justifyContent:'center' },
  tagline: { fontSize: 11, color: '#285b76' },
  gradeCaret: { fontSize: 12, color: colors.ink },
  profile: { flexDirection: 'row', alignItems: 'center', minHeight: 48 },
  avatar: { borderRadius: 24, borderWidth: 2, borderColor: 'white', zIndex:1 },
  gradePill: { flexDirection:'row',alignItems:'center',gap:5,minHeight:34,marginLeft:-6,paddingLeft:12,paddingRight:10,borderRadius:18,backgroundColor:'#ffffff75' },
  grade: { fontSize: 12, fontWeight: '700', color: colors.ink },
  bell: { width: 38, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 5, backgroundColor: '#ff4b44', position: 'absolute', right: 4, top: 9, borderWidth: 1, borderColor: 'white' },
  hero: { flex:1, alignSelf: 'stretch' },
  body: { paddingHorizontal: 14, marginTop: -10 },
  features: { padding: 10, paddingTop: 11, backgroundColor: 'white', borderRadius: 22, flexDirection: 'row', justifyContent: 'space-between', gap: 7, ...shadow },
  feature: { alignItems: 'center', borderRadius:17, paddingBottom: 8, overflow: 'hidden' },
  featureTitle: { fontSize: 11, fontWeight: '800', color: colors.ink, marginTop: 5, maxWidth: '100%' },
  featureCaption: { fontSize: 9, color: colors.muted, marginTop: 4, maxWidth: '100%' },
  task: { marginTop: 13, borderRadius: 17, overflow: 'hidden', backgroundColor: '#fff2b7', ...shadow },
  countBadge: { position:'absolute',top:8,right:12,minWidth:46,minHeight:26,alignItems:'center',justifyContent:'center',backgroundColor: '#ff6948', borderRadius: 14, paddingVertical: 3, paddingHorizontal: 9, borderWidth: 1.5, borderColor: 'white' },
  countText: { fontSize: 12, fontWeight: '800', color: 'white' },
  analytics: { marginTop: 13, paddingHorizontal: 12, paddingTop: 12, paddingBottom: 6, borderRadius: 18, backgroundColor: 'white', overflow: 'hidden', ...shadow },
  analysisHeading: { minHeight: 25, flexDirection: 'row', gap: 6, alignItems: 'center', flexWrap: 'wrap' },
  sectionTitle: { fontSize: 14, fontWeight: '900', color: colors.ink },
  weakBadge: { marginLeft: 'auto', backgroundColor: '#ffe7e6', borderRadius: 12, paddingHorizontal: 7, paddingVertical: 5 },
  weakText: { fontSize: 9, color: '#cf3d42', fontWeight: '700' },
  analysisBody: { minHeight: 112, flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  bars: { flex: 1, gap: 12, zIndex: 1, paddingRight: 80 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  barLabel: { fontSize: 10, color: colors.ink, width: 66, fontWeight: '600' },
  barTrack: { height: 8, flex: 1, backgroundColor: '#deeffa', borderRadius: 8, overflow: 'hidden', minWidth: 24 },
  barFill: { height: 8, borderRadius: 8 },
  barCount: { fontSize: 10, color: colors.muted, width: 27, textAlign: 'right' },
  fox: { position: 'absolute', right: -5, bottom: -8 },
  recentHeading: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 11 },
  more: { marginLeft: 'auto', minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 5 },
  moreText: { fontSize: 11, color: colors.muted },
  recentGrid: { flexDirection: 'row', gap: 10 },
  recentCard: { flex: 1, borderWidth: 1, borderColor: '#e2edf8', overflow: 'hidden', borderRadius: 11, backgroundColor: 'white', ...shadow },
  paperPreview: { height: 52, width: '100%' },
  recentInfo: { padding: 6, gap: 5 },
  recentTitle: { fontSize: 10, fontWeight: '800', color: colors.ink },
  recentMeta: { minHeight: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 2 },
  status: { borderRadius: 9, paddingHorizontal: 5, paddingVertical: 3 },
  statusText: { fontSize: 8, fontWeight: '700' },
  recentDate: { flex: 1, fontSize: 8, color: colors.muted },
  emptyText: { fontSize: 13, color: colors.muted, paddingVertical: 18, lineHeight: 22 },
  pressed: { opacity: 0.78 },
});
