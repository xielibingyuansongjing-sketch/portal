
import type { Post, QuickLink, CommitteesByYear, ScheduleEvent, DirectoryEntry, EventColor, HospitalLogEntry, LogCategory, DutyLogEntry, DutyLogCategory } from './types';
import { HomeIcon, ChatBubbleLeftRightIcon, DocumentTextIcon, CalendarIcon, UserGroupIcon, Cog6ToothIcon, CommitteeIcon, PhoneIcon, JournalIcon, MoonIcon } from './components/icons/Icons';

export const INITIAL_POSTS: Post[] = [
  { 
    id: 1, 
    category: '重要', 
    date: '2023-10-27', 
    title: '【至急】全職員向け: 年末調整の書類提出について', 
    author: '総務課', 
    content: '年末調整に関する書類を11月10日までに提出してください。詳細は添付ファイルをご確認ください。',
    attachments: [
        { name: '年末調整案内.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        { name: '記入例.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    ],
    isVisible: true,
  },
  { 
    id: 2, 
    category: '研修', 
    date: '2023-10-26', 
    title: '11月度 医療安全研修会（テーマ: 誤薬防止）のご案内', 
    author: '医療安全管理室',
    content: '来月の医療安全研修会は「誤薬防止」をテーマに開催します。多くの皆様のご参加をお待ちしております。',
    attachments: [],
    isVisible: true,
  },
  { 
    id: 3, 
    category: '通知', 
    date: '2023-10-25', 
    title: 'インフルエンザワクチン予防接種の予約受付開始', 
    author: '健康管理室',
    content: '職員向けのインフルエンザワクチン予防接種の予約を開始しました。予約サイトからお申し込みください。',
    attachments: [],
    isVisible: true,
  },
    { 
    id: 4, 
    category: '通知', 
    date: '2023-10-24', 
    title: '院内食堂のメニュー更新（11月）のお知らせ',
    author: '福利厚生課',
    content: '11月の食堂メニューを更新しました。新しいメニューをお楽しみください。',
    attachments: [{ name: '11月メニュー.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }],
    isVisible: true,
  },
  { 
    id: 5, 
    category: '重要', 
    date: '2023-10-23', 
    title: 'システムメンテナンスに伴う電子カルテ停止のお知らせ（10/29 深夜）',
    author: '情報システム課',
    content: '10月29日(日)の深夜帯にシステムメンテナンスを実施します。期間中は電子カルテシステムが利用できなくなりますのでご注意ください。',
    attachments: [],
    isVisible: true,
  },
  { 
    id: 6, 
    category: '一般', 
    date: '2023-10-22', 
    title: '院内美化週間のお知らせ',
    author: '総務課',
    content: '11月6日より院内美化週間です。ご協力をお願いします。',
    attachments: [],
    isVisible: true,
  },
  { 
    id: 7, 
    category: '研修', 
    date: '2023-10-21', 
    title: '新人看護師向けフォローアップ研修',
    author: '看護部',
    content: '入職半年後のフォローアップ研修を実施します。対象者には別途通知します。',
    attachments: [],
    isVisible: true,
  },
  { 
    id: 8, 
    category: '周知', 
    date: '2023-10-20', 
    title: '内線番号変更のお知らせ',
    author: '情報システム課',
    content: '一部部署の内線番号が変更になります。詳細は添付の一覧をご確認ください。',
    attachments: [{ name: '内線番号一覧.pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }],
    isVisible: true,
  },
  { 
    id: 9, 
    category: '通知', 
    date: '2023-10-19', 
    title: '健康診断の予約について',
    author: '健康管理室',
    content: '年に一度の健康診断の予約を開始しました。各自予約システムより予約してください。',
    attachments: [],
    isVisible: true,
  },
  { 
    id: 10, 
    category: '一般', 
    date: '2023-10-18', 
    title: '図書室より新刊入荷のお知らせ',
    author: '図書室',
    content: '最新の医学雑誌、専門書が入荷しました。ぜひご利用ください。',
    attachments: [],
    isVisible: true,
  },
  { 
    id: 11, 
    category: '重要', 
    date: '2023-10-17', 
    title: '台風接近に伴う業務体制について',
    author: '災害対策本部',
    content: '台風の接近が予測されています。今後の情報に注意し、各自の行動計画を確認してください。',
    attachments: [],
    isVisible: true,
  },
];

export const QUICK_LINKS: QuickLink[] = [
  { id: 1, label: '電子カルテ', icon: DocumentTextIcon },
  { id: 2, label: '勤務シフト', icon: CalendarIcon },
  { id: 3, label: '院内規定集', icon: DocumentTextIcon },
  { id: 4, label: 'ITヘルプデスク', icon: ChatBubbleLeftRightIcon },
  { id: 5, label: '職員名簿', icon: UserGroupIcon },
  { id: 6, label: '会議室予約', icon: CalendarIcon },
  { id: 8, label: '院内内線表', icon: PhoneIcon, navTarget: 'internal-directory' },
];

export const NAVIGATION_LINKS = [
    { id: 'dashboard', label: 'ダッシュボード', icon: HomeIcon },
    { id: 'ai-assistant', label: 'AIアシスタント', icon: ChatBubbleLeftRightIcon },
    { id: 'documents', label: 'ドキュメント', icon: DocumentTextIcon },
    { id: 'schedule', label: 'スケジュール', icon: CalendarIcon },
    { id: 'hospital-log', label: '病院日誌', icon: JournalIcon },
    { id: 'duty-log', label: '当直日誌', icon: MoonIcon },
    { id: 'directory', label: '職員名簿', icon: UserGroupIcon },
    { id: 'committee', label: '委員会', icon: CommitteeIcon },
    { id: 'admin', label: '管理画面', icon: Cog6ToothIcon },
];

const generateMinutes = (year: number) => {
    const months = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3];
    return months.map(month => {
        const attachments = [];
        const numAttachments = Math.random() > 0.4 ? Math.floor(Math.random() * 3) : 0; // 60% chance of 1-2 attachments
        if (numAttachments > 0) {
            for (let i = 0; i < numAttachments; i++) {
                const day = Math.floor(Math.random() * 28) + 1;
                const currentYear = month >= 4 ? year : year + 1;
                attachments.push({
                    id: Date.now() + Math.random(),
                    fileName: `(${month}月)資料${i + 1}.pdf`,
                    uploadedDate: `${currentYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
                    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                });
            }
        }
        return { month, attachments };
    });
};

const committeesTemplate = [
    { id: 1, name: '感染対策委員会' },
    { id: 2, name: '医療安全管理委員会' },
    { id: 3, name: '褥瘡対策委員会' },
    { id: 4, name: '栄養サポートチーム（NST）委員会' },
    { id: 5, name: '個人情報保護委員会' },
    { id: 6, name: '倫理委員会' },
    { id: 7, name: 'クリニカルパス委員会' },
    { id: 8, name: '広報委員会' },
];

export const COMMITTEES_DATA_BY_YEAR: CommitteesByYear = {
    2024: committeesTemplate.map(c => ({ ...c, minutes: generateMinutes(2024) })),
    2023: committeesTemplate.map(c => ({ ...c, minutes: generateMinutes(2023) })),
    2022: committeesTemplate.map(c => ({ ...c, minutes: generateMinutes(2022) })),
};

const d = new Date();
const currentYear = d.getFullYear();
const currentMonth = String(d.getMonth() + 1).padStart(2, '0');
const todayString = `${currentYear}-${currentMonth}-${String(d.getDate()).padStart(2,'0')}`;

const yesterday = new Date();
yesterday.setDate(d.getDate() - 1);
const yesterdayString = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2,'0')}`;


export const EVENT_COLORS: EventColor[] = [
  { key: 'blue', name: '重要', bgClass: 'bg-blue-100', textClass: 'text-blue-800', hoverBgClass: 'hover:bg-blue-200' },
  { key: 'green', name: '会議', bgClass: 'bg-green-100', textClass: 'text-green-800', hoverBgClass: 'hover:bg-green-200' },
  { key: 'yellow', name: '研修', bgClass: 'bg-yellow-100', textClass: 'text-yellow-800', hoverBgClass: 'hover:bg-yellow-200' },
  { key: 'purple', name: 'その他', bgClass: 'bg-purple-100', textClass: 'text-purple-800', hoverBgClass: 'hover:bg-purple-200' },
];

export const INITIAL_SCHEDULE_EVENTS: ScheduleEvent[] = [
    { id: 1, date: `${currentYear}-${currentMonth}-10`, title: '医療安全研修会', startTime: '17:00', authorId: 1, authorName: '田中 太郎', color: 'yellow' },
    { id: 2, date: `${currentYear}-${currentMonth}-15`, title: '院内全体会議', startTime: '13:00', endTime: '14:00', description: '議題：来年度の予算について', authorId: 2, authorName: '総務課', color: 'green' },
    { id: 3, date: `${currentYear}-${currentMonth}-15`, title: '合同カンファレンス', startTime: '18:00', authorId: 1, authorName: '田中 太郎', color: 'green' },
    { id: 4, date: `${currentYear}-${currentMonth}-22`, title: '新人フォローアップ研修', startTime: '09:00', endTime: '12:00', authorId: 3, authorName: '看護部', color: 'yellow' },
    { id: 5, date: `${currentYear}-${String(d.getMonth() + 2).padStart(2,'0')}-05`, title: '感染対策委員会', startTime: '15:00', authorId: 2, authorName: '総務課', color: 'purple' }
];

export const INITIAL_DIRECTORY_ENTRIES: DirectoryEntry[] = [
    { id: 1, department: '総合案内', name: '受付', extension: '100' },
    { id: 2, department: '総合案内', name: '会計', extension: '101' },
    { id: 3, department: '内科', name: '外来受付', extension: '210' },
    { id: 4, department: '内科', name: 'ナースステーション', extension: '211' },
    { id: 5, department: '外科', name: '外来受付', extension: '220' },
    { id: 6, department: '外科', name: 'ナースステーション', extension: '221' },
    { id: 7, department: '2階病棟', name: 'ナースステーション', extension: '320' },
    { id: 8, department: '3階病棟', name: 'ナースステーション', extension: '330' },
    { id: 9, department: '薬局', name: '受付', extension: '410' },
    { id: 10, department: '薬局', name: '調剤室', extension: '411' },
    { id: 11, department: '放射線科', name: '受付', extension: '420' },
    { id: 12, department: '検査科', name: '受付', extension: '430' },
    { id: 13, department: 'リハビリテーション科', name: '受付', extension: '440' },
    { id: 14, department: '事務部', name: '総務課', extension: '501' },
    { id: 15, department: '事務部', name: '経理課', extension: '502' },
    { id: 16, department: '栄養科', name: '事務室', extension: '450'},
    { id: 17, department: '情報システム課', name: 'ヘルプデスク', extension: '505'},
];


export const LOG_CATEGORIES: { key: LogCategory, name: string, color: string }[] = [
    { key: '申し送り', name: '申し送り', color: 'bg-blue-100 text-blue-800' },
    { key: '患者イベント', name: '患者イベント', color: 'bg-green-100 text-green-800' },
    { key: '設備', name: '設備', color: 'bg-yellow-100 text-yellow-800' },
    { key: '一般', name: '一般', color: 'bg-slate-100 text-slate-800' },
];

export const INITIAL_HOSPITAL_LOG_ENTRIES: HospitalLogEntry[] = [
    { id: 1, date: todayString, time: '08:30', authorId: 100, authorName: '鈴木 一郎', category: '申し送り', content: '夜勤からの申し送り: 302号室の佐藤様、夜間穏やかに過ごされました。特に変わりありません。' },
    { id: 2, date: todayString, time: '09:15', authorId: 1, authorName: '田中 太郎', category: '患者イベント', content: '501号室の鈴木様、本日10時にCT検査予定。前回の検査結果も確認済み。' },
    { id: 3, date: todayString, time: '11:05', authorId: 1, authorName: '田中 太郎', category: '一般', content: '本日午後の回診は14時から開始予定です。' },
    { id: 4, date: todayString, time: '12:30', authorId: 1, authorName: '田中 太郎', category: '設備', content: '2階ナースステーションの血圧計の調子が悪いため、ME室に点検依頼済。' },
    { id: 5, date: todayString, time: '14:20', authorId: 100, authorName: '鈴木 一郎', category: '患者イベント', content: '302号室の佐藤様、リハビリテーションを完了。バイタル安定しています。' },
];

export const DUTY_LOG_CATEGORIES: { key: DutyLogCategory, name: string, color: string }[] = [
    { key: '申し送り', name: '申し送り', color: 'bg-blue-100 text-blue-800' },
    { key: '緊急対応', name: '緊急対応', color: 'bg-red-100 text-red-800' },
    { key: '電話対応', name: '電話対応', color: 'bg-green-100 text-green-800' },
    { key: '設備トラブル', name: '設備トラブル', color: 'bg-yellow-100 text-yellow-800' },
    { key: 'その他', name: 'その他', color: 'bg-slate-100 text-slate-800' },
];

export const INITIAL_DUTY_LOG_ENTRIES: DutyLogEntry[] = [
    { id: 1, dutyDate: todayString, time: '17:30', authorId: 100, authorName: '鈴木 一郎', category: '申し送り', content: '日勤からの申し送り事項: 305号室の田中様、午後に微熱あり。経過観察中。' },
    { id: 2, dutyDate: todayString, time: '21:05', authorId: 1, authorName: '田中 太郎', category: '電話対応', content: '401号室の加藤様の家族から容態確認の電話あり。変わりない旨を伝える。' },
    { id: 3, dutyDate: todayString, time: '23:45', authorId: 1, authorName: '田中 太郎', category: '緊急対応', content: '210号室の山田様が胸痛を訴え、当直医に報告。心電図実施、バイタル安定。' },
    { id: 4, dutyDate: yesterdayString, time: '02:15', authorId: 1, authorName: '田中 太郎', category: '設備トラブル', content: '3階西側廊下の照明が一部消灯。施設課に連絡、明朝対応予定。' },
    { id: 5, dutyDate: todayString, time: '06:00', authorId: 1, authorName: '田中 太郎', category: '申し送り', content: '日勤への申し送り: 210号室の山田様、夜間は落ち着いて過ごされた。朝の採血実施済み。' },
];
