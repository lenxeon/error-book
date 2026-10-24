import React, { useState } from 'react';
import { Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, IconName } from '../components/Icon';
import { SavedState } from '../data/model';
import { colors, shadow } from '../theme';

type Sheet = 'data' | 'privacy' | 'about' | null;
type Props = {
  state: SavedState;
  editProfile: () => void;
  setDailyGoal: (goal: number) => void;
  setReminderEnabled: (enabled: boolean) => void;
  setReminderTime: (time: string) => void;
};

const reminderTimes = ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00'];

export function Profile({ state, editProfile, setDailyGoal, setReminderEnabled, setReminderTime }: Props) {
  const [sheet, setSheet] = useState<Sheet>(null);

  function adjustGoal(delta: number) {
    setDailyGoal(Math.max(1, Math.min(20, state.profile.dailyGoal + delta)));
  }
  function nextReminderTime() {
    const index = reminderTimes.indexOf(state.profile.reminderTime);
    setReminderTime(reminderTimes[(index + 1) % reminderTimes.length]);
  }

  return <>
    <View style={s.page}>
    <ScrollView testID="profile-scroll" style={s.screen} showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
      <LinearGradient colors={['#f2fff9', '#e8f9f1']} style={s.profileCard}>
        <View pointerEvents="none" style={s.profileDecor}>
          <View style={[s.leaf, s.leafLeftOne]} /><View style={[s.leaf, s.leafLeftTwo]} /><View style={[s.leaf, s.leafLeftThree]} />
          <View style={[s.leaf, s.leafRightOne]} /><View style={[s.leaf, s.leafRightTwo]} /><View style={[s.leaf, s.leafRightThree]} />
          <View style={s.bottomWash} />
        </View>
        <View style={s.profileLayout}>
        <View style={s.profileTop}>
          <View style={s.avatarRing}><Image accessibilityLabel="学生头像" source={require('../../ui/designs/profile-avatar-v7.png')} style={s.avatar} /></View>
          <View style={s.identity}>
            <Text style={s.eyebrow}>学生档案</Text>
            <Text numberOfLines={1} style={s.name}>{state.profile.displayName.trim() || '小麦同学'}</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="编辑孩子资料" onPress={editProfile} style={({ pressed }) => [s.editButton, pressed && s.pressed]}>
            <Image accessibilityElementsHidden source={require('../../ui/designs/profile-icon-pencil.png')} style={s.editPencil} />
          </Pressable>
        </View>
        <View style={s.profileDetails}>
          <View style={s.profileDivider} />
          <View style={s.gradeRow}>
            <View style={s.gradeCopy}><Text style={s.gradeLabel}>当前年级</Text><Text style={s.gradeValue}>{state.profile.grade}</Text></View>
          </View>
        </View>
        </View>
      </LinearGradient>

      <View style={s.infoCardsRow}>
        <InfoCard icon="check" gradient={['#fff5fb', '#f6dff3']} webBackground={statBackgrounds.pink} color="#e46bad" labelColor="#755169" label="今日已做" value={`${state.completed.length}`} unit="题" />
        <InfoCard icon="target" gradient={['#f4ffef', '#d8f3cd']} webBackground={statBackgrounds.green} color="#54b96e" labelColor="#416449" label="每日目标" value={`${state.profile.dailyGoal}`} unit="题" />
        <InfoCard icon="bell" gradient={['#f3fbff', '#d7edf7']} webBackground={statBackgrounds.blue} color="#4a9ad3" labelColor="#47677a" label="学习提醒" value={state.profile.reminderEnabled ? state.profile.reminderTime : '关闭'} unit="" />
      </View>

      <View style={s.settingsHeading}><View style={s.headingDot} /><Text style={s.settingsTitle}>系统设置</Text><Text style={s.settingsCaption}>学习安排与本机管理</Text></View>
      <View style={s.settingsCard}>
        <View style={s.settingRow}>
          <SettingIcon name="target" tint="#fff2cf" color="#ec9b12" />
          <View style={s.settingCopy}><Text style={s.settingTitle}>每日练习目标</Text><Text style={s.settingSubtitle}>设置每天的练习题量</Text></View>
          <View style={s.goalControl}>
            <Pressable accessibilityRole="button" accessibilityLabel="减少每日练习目标" accessibilityState={{ disabled: state.profile.dailyGoal <= 1 }} disabled={state.profile.dailyGoal <= 1} onPress={() => adjustGoal(-1)} style={({ pressed }) => [s.goalButton, pressed && s.pressed, state.profile.dailyGoal <= 1 && s.disabled]}><Text style={s.goalMinus}>−</Text></Pressable>
            <Text accessibilityLiveRegion="polite" style={s.goalValue}>{state.profile.dailyGoal}题</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="增加每日练习目标" accessibilityState={{ disabled: state.profile.dailyGoal >= 20 }} disabled={state.profile.dailyGoal >= 20} onPress={() => adjustGoal(1)} style={({ pressed }) => [s.goalButton, pressed && s.pressed, state.profile.dailyGoal >= 20 && s.disabled]}><Text style={s.goalPlus}>＋</Text></Pressable>
          </View>
        </View>
        <View style={s.divider} />
        <View style={s.settingRow}>
          <SettingIcon name="bell" tint="#e1f8ee" color="#00a77b" />
          <View style={s.settingCopy}><Text style={s.settingTitle}>学习提醒</Text><Text style={s.settingSubtitle}>按时提醒孩子学习</Text></View>
          <Pressable accessibilityRole="button" accessibilityLabel={`提醒时间，每天 ${state.profile.reminderTime}，点击更改`} onPress={nextReminderTime} style={({ pressed }) => [s.timeButton, pressed && s.pressed]}><Text style={s.timeText}>每天 {state.profile.reminderTime}</Text></Pressable>
          <Switch accessibilityLabel="开启学习提醒偏好" value={state.profile.reminderEnabled} onValueChange={setReminderEnabled} trackColor={{ false: '#d6e2ed', true: '#19bd92' }} thumbColor="#ffffff" ios_backgroundColor="#d6e2ed" />
        </View>
        <View style={s.divider} />
        <SettingLink icon="database" tint="#e8f5fb" color="#2a8db8" title="本机数据管理" subtitle="了解本机保存与隐私方式" onPress={() => setSheet('data')} />
        <View style={s.divider} />
        <SettingLink icon="shield" tint="#e8f6f2" color="#099a83" title="隐私与数据" subtitle="隐私说明与本机存储方式" onPress={() => setSheet('privacy')} />
        <View style={s.divider} />
        <SettingLink icon="info" tint="#f0eaff" color="#8863d2" title="关于麦森错题本" subtitle="版本信息与产品说明" trailing="1.0.0" onPress={() => setSheet('about')} last />
      </View>
      <Text style={s.reminderNote}>提醒偏好保存在本机，当前版本暂未接入系统推送。</Text>
    </ScrollView>
    </View>

    <Modal visible={sheet !== null} transparent animationType="fade" onRequestClose={() => setSheet(null)}>
      <Pressable accessibilityRole="button" accessibilityLabel="关闭设置说明" onPress={() => setSheet(null)} style={s.scrim}>
        <Pressable accessibilityViewIsModal onPress={() => {}} style={s.sheet}>
          <View style={s.sheetHeading}><Text style={s.sheetTitle}>{sheet === 'data' ? '本机数据管理' : sheet === 'privacy' ? '隐私与数据' : '关于麦森错题本'}</Text><Pressable accessibilityRole="button" accessibilityLabel="关闭" onPress={() => setSheet(null)} hitSlop={12} style={s.closeButton}><Icon name="close" size={18} color={colors.muted} /></Pressable></View>
          {sheet === 'data' ? <>
            <Text style={s.sheetBody}>学习资料和提醒偏好保存在这台设备的应用空间中。你可以在系统设置中管理应用存储权限。</Text>
          </> : sheet === 'privacy' ? <Text style={s.sheetBody}>当前无需注册。个人资料和应用偏好保存在本机，当前版本不会上传到云端。卸载应用会移除本机数据。</Text> : <>
            <Text style={s.sheetBody}>麦森错题本 · 1.0.0</Text><Text style={s.sheetBody}>陪孩子整理错题、安排练习，在每一次复习中看见进步。</Text>
          </>}
        </Pressable>
      </Pressable>
    </Modal>
  </>;
}

function SettingIcon({ name, tint, color }: { name: IconName; tint: string; color: string }) {
  return <View style={[s.settingIcon, { backgroundColor: tint }]}><Icon name={name} size={21} color={color} /></View>;
}

const statBackgrounds = {
  pink: 'radial-gradient(circle at 16% 10%, rgba(255, 255, 255, 0.95) 0, rgba(255, 255, 255, 0) 35%), radial-gradient(circle at 96% 108%, #eabcf0 0, rgba(234, 188, 240, 0) 52%), linear-gradient(145deg, #fff5fb 0%, #f6dff3 100%)',
  green: 'radial-gradient(circle at 16% 10%, rgba(255, 255, 255, 0.95) 0, rgba(255, 255, 255, 0) 35%), radial-gradient(circle at 96% 108%, #bceaa9 0, rgba(188, 234, 169, 0) 52%), linear-gradient(145deg, #f4ffef 0%, #d8f3cd 100%)',
  blue: 'radial-gradient(circle at 16% 10%, rgba(255, 255, 255, 0.95) 0, rgba(255, 255, 255, 0) 35%), radial-gradient(circle at 96% 108%, #b9dced 0, rgba(185, 220, 237, 0) 52%), linear-gradient(145deg, #f3fbff 0%, #d7edf7 100%)',
};

function InfoCard({ icon, gradient, webBackground, color, labelColor, label, value, unit }: { icon: IconName; gradient: [string, string]; webBackground: string; color: string; labelColor: string; label: string; value: string; unit: string }) {
  return <LinearGradient accessibilityLabel={`${label}：${value}${unit}`} colors={gradient} style={[s.infoCard, Platform.OS === 'web' ? ({ backgroundImage: webBackground } as any) : undefined, { shadowColor: color }]}>
    <View style={s.infoValueLine}><Icon name={icon} size={25} color={color} /><Text numberOfLines={1} adjustsFontSizeToFit style={s.infoValue}>{value}</Text>{unit ? <Text style={s.infoUnit}>{unit}</Text> : null}</View>
    <Text numberOfLines={1} style={[s.infoLabel, { color: labelColor }]}>{label}</Text>
  </LinearGradient>;
}

function SettingLink({ icon, tint, color, title, subtitle, trailing, onPress, last }: { icon: IconName; tint: string; color: string; title: string; subtitle: string; trailing?: string; onPress: () => void; last?: boolean }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [s.settingRow, pressed && s.pressed]}>
    <SettingIcon name={icon} tint={tint} color={color} />
    <View style={s.settingCopy}><Text style={s.settingTitle}>{title}</Text><Text numberOfLines={1} style={s.settingSubtitle}>{subtitle}</Text></View>
    {trailing ? <Text style={s.version}>{trailing}</Text> : null}
    <Text style={[s.rowChevron, last && s.lastChevron]}>›</Text>
  </Pressable>;
}

const s = StyleSheet.create({
  page: { flex: 1 },
  screen: { flex: 1, backgroundColor: 'transparent' },
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 },
  profileCard: { position: 'relative', overflow: 'hidden', paddingHorizontal: 16, paddingVertical: 13, borderRadius: 27, borderWidth: 1.5, borderColor: '#ccefe0', ...shadow },
  profileDecor: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
  bottomWash: { position: 'absolute', left: -20, right: -20, bottom: -23, height: 43, borderTopLeftRadius: 90, borderTopRightRadius: 90, backgroundColor: 'rgba(115,226,186,0.10)' },
  leaf: { position: 'absolute', bottom: -9, width: 19, height: 38, borderRadius: 20, backgroundColor: 'rgba(90,211,168,0.20)' },
  leafLeftOne: { left: 5, transform: [{ rotate: '-38deg' }] },
  leafLeftTwo: { left: 20, bottom: -5, width: 22, height: 44, transform: [{ rotate: '-5deg' }] },
  leafLeftThree: { left: 37, transform: [{ rotate: '35deg' }] },
  leafRightOne: { right: 5, transform: [{ scaleX: -1 }, { rotate: '-38deg' }] },
  leafRightTwo: { right: 20, bottom: -5, width: 22, height: 44, transform: [{ scaleX: -1 }, { rotate: '-5deg' }] },
  leafRightThree: { right: 37, transform: [{ scaleX: -1 }, { rotate: '35deg' }] },
  profileLayout: { position: 'relative', zIndex: 2, paddingHorizontal: 4 },
  profileTop: { minHeight: 88, flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarRing: { width: 82, height: 82, borderRadius: 42, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#bcebdc', backgroundColor: '#ffffff', ...shadow },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#d9f7ee' },
  identity: { flex: 1, minWidth: 80 },
  eyebrow: { color: '#618c7e', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  name: { color: colors.ink, fontSize: 22, fontWeight: '900' },
  editButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.97)', ...shadow },
  editPencil: { width: 23, height: 23 },
  profileDetails: { marginLeft: 94 },
  profileDivider: { height: 1, marginTop: 2, backgroundColor: 'rgba(26,111,104,0.14)' },
  gradeRow: { minHeight: 55, flexDirection: 'row', alignItems: 'center' },
  gradeCopy: { gap: 2 },
  gradeLabel: { color: '#668196', fontSize: 11 },
  gradeValue: { color: '#123b63', fontSize: 15, fontWeight: '800' },
  infoCardsRow: { flexDirection: 'row', gap: 9, marginTop: 15 },
  infoCard: { flex: 1, minWidth: 0, height: 89, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, paddingVertical: 9, borderRadius: 14, overflow: 'hidden', ...shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.13, shadowRadius: 8, elevation: 4 },
  infoValueLine: { maxWidth: '100%', minHeight: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  infoValue: { color: '#1f2937', fontSize: 22, lineHeight: 26, fontWeight: '900', fontVariant: ['tabular-nums'] },
  infoUnit: { marginLeft: -3, marginTop: 8, color: '#647e99', fontSize: 10, lineHeight: 12, fontWeight: '800' },
  infoLabel: { marginTop: 6, color: '#405d7b', fontSize: 11, lineHeight: 14, fontWeight: '800' },
  settingsHeading: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 16, marginBottom: 8, paddingHorizontal: 3 },
  headingDot: { width: 8, height: 8, borderRadius: 5, backgroundColor: '#ffbd43' },
  settingsTitle: { color: colors.ink, fontSize: 16, fontWeight: '900' },
  settingsCaption: { color: '#6885a5', fontSize: 10, marginLeft: 'auto' },
  settingsCard: { borderRadius: 23, paddingHorizontal: 12, paddingVertical: 3, backgroundColor: 'rgba(255,255,255,0.94)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.98)', ...shadow },
  settingRow: { minHeight: 70, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 3 },
  settingIcon: { width: 43, height: 43, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  settingCopy: { flex: 1, minWidth: 70 },
  settingTitle: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  settingSubtitle: { color: '#6e89a8', fontSize: 10, marginTop: 4 },
  goalControl: { height: 46, paddingHorizontal: 5, flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 24, backgroundColor: '#fff5dc' },
  goalButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  goalMinus: { color: '#6283a4', fontSize: 22, lineHeight: 26, fontWeight: '600' },
  goalPlus: { color: '#079976', fontSize: 18, lineHeight: 24, fontWeight: '800' },
  goalValue: { minWidth: 31, textAlign: 'center', color: '#557397', fontSize: 12, fontWeight: '900' },
  disabled: { opacity: 0.45 },
  timeButton: { paddingHorizontal: 5, paddingVertical: 8 },
  timeText: { color: '#58779a', fontSize: 10, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#e3eff6', marginLeft: 54 },
  rowChevron: { marginLeft: 0, color: '#829bb5', fontSize: 24, lineHeight: 26 },
  lastChevron: { marginRight: 1 },
  version: { color: '#8199b5', fontSize: 11, marginRight: 2 },
  reminderNote: { marginTop: 8, marginHorizontal: 5, marginBottom: 4, color: '#6784a1', fontSize: 10, textAlign: 'center' },
  pressed: { opacity: 0.72 },
  scrim: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 22, backgroundColor: 'rgba(14,39,67,0.42)' },
  sheet: { width: '100%', maxWidth: 400, padding: 22, borderRadius: 24, backgroundColor: '#f8fcff', ...shadow },
  sheetHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sheetTitle: { color: colors.ink, fontSize: 19, fontWeight: '900' },
  closeButton: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', borderRadius: 17, backgroundColor: '#eaf4fa' },
  sheetBody: { color: '#557397', fontSize: 14, lineHeight: 23, marginBottom: 8 },
});
