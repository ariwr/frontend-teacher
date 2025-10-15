"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  ChartBarIcon, 
  PlusIcon,
  TrashIcon,
  EyeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline"

interface Subject {
  id: string
  name: string
  category: string
  grade: string
  credits: number
  maxStudents: number
  description: string
}

interface Teacher {
  id: string
  name: string
  subjects: string[]
  maxHours: number
  currentHours: number
}

interface Classroom {
  id: string
  name: string
  capacity: number
  type: '일반' | '특별실' | '실험실'
  equipment: string[]
}

interface Survey {
  id: string
  title: string
  targetGrade: string
  startDate: string
  endDate: string
  status: 'draft' | 'active' | 'completed'
  subjects: string[]
  responses: StudentResponse[]
}

interface StudentResponse {
  studentId: string
  studentName: string
  preferences: { subjectId: string; priority: number }[]
  submitted: boolean
  submittedAt?: string
}

interface TimetableSlot {
  id: string
  day: string
  period: number
  subject?: Subject
  teacher?: Teacher
  classroom?: Classroom
  students: string[]
}

export default function SubjectSurveyPage() {
  const [currentStep, setCurrentStep] = useState<'master' | 'survey' | 'analysis' | 'timetable'>('master')
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null)
  
  // Master Data States
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: '고급수학', category: '수학', grade: '3', credits: 4, maxStudents: 30, description: '미적분과 통계' },
    { id: '2', name: '영어독해', category: '영어', grade: '3', credits: 3, maxStudents: 25, description: '고급 독해 및 작문' },
    { id: '3', name: '물리학실험', category: '과학', grade: '3', credits: 2, maxStudents: 20, description: '실험 중심 물리학' }
  ])
  
  const [teachers, setTeachers] = useState<Teacher[]>([
    { id: '1', name: '김수학', subjects: ['1'], maxHours: 20, currentHours: 0 },
    { id: '2', name: '이영어', subjects: ['2'], maxHours: 18, currentHours: 0 },
    { id: '3', name: '박물리', subjects: ['3'], maxHours: 16, currentHours: 0 }
  ])
  
  const [classrooms, setClassrooms] = useState<Classroom[]>([
    { id: '1', name: '3-1교실', capacity: 30, type: '일반', equipment: ['칠판', '프로젝터'] },
    { id: '2', name: '3-2교실', capacity: 25, type: '일반', equipment: ['칠판', '프로젝터'] },
    { id: '3', name: '물리실험실', capacity: 20, type: '실험실', equipment: ['실험대', '기구', '안전장비'] }
  ])

  // Survey States
  const [surveys, setSurveys] = useState<Survey[]>([
    {
      id: '1',
      title: '2024학년도 2학기 3학년 과목 수요 조사',
      targetGrade: '3',
      startDate: '2024-01-15',
      endDate: '2024-01-25',
      status: 'active',
      subjects: ['1', '2', '3'],
      responses: [
        {
          studentId: 's1',
          studentName: '김철수',
          preferences: [
            { subjectId: '1', priority: 1 },
            { subjectId: '2', priority: 2 },
            { subjectId: '3', priority: 3 }
          ],
          submitted: true,
          submittedAt: '2024-01-20'
        },
        {
          studentId: 's2',
          studentName: '이영희',
          preferences: [
            { subjectId: '2', priority: 1 },
            { subjectId: '1', priority: 2 },
            { subjectId: '3', priority: 3 }
          ],
          submitted: true,
          submittedAt: '2024-01-21'
        }
      ]
    }
  ])

  const [newSubject, setNewSubject] = useState({
    name: '',
    category: '',
    grade: '',
    credits: 0,
    maxStudents: 0,
    description: ''
  })

  const [newTeacher, setNewTeacher] = useState({
    name: '',
    subjects: [] as string[],
    maxHours: 0
  })

  const [newClassroom, setNewClassroom] = useState({
    name: '',
    capacity: 0,
    type: '일반' as '일반' | '특별실' | '실험실',
    equipment: [] as string[]
  })

  const [newSurvey, setNewSurvey] = useState({
    title: '',
    targetGrade: '',
    startDate: '',
    endDate: '',
    subjects: [] as string[]
  })

  // Timetable States
  const [timetable, setTimetable] = useState<TimetableSlot[]>([])
  const [conflicts, setConflicts] = useState<string[]>([])

  const addSubject = () => {
    if (newSubject.name && newSubject.category) {
      const subject: Subject = {
        id: Date.now().toString(),
        ...newSubject
      }
      setSubjects([...subjects, subject])
      setNewSubject({ name: '', category: '', grade: '', credits: 0, maxStudents: 0, description: '' })
    }
  }

  const addTeacher = () => {
    if (newTeacher.name) {
      const teacher: Teacher = {
        id: Date.now().toString(),
        ...newTeacher,
        currentHours: 0
      }
      setTeachers([...teachers, teacher])
      setNewTeacher({ name: '', subjects: [], maxHours: 0 })
    }
  }

  const addClassroom = () => {
    if (newClassroom.name) {
      const classroom: Classroom = {
        id: Date.now().toString(),
        ...newClassroom
      }
      setClassrooms([...classrooms, classroom])
      setNewClassroom({ name: '', capacity: 0, type: '일반', equipment: [] })
    }
  }

  const createSurvey = () => {
    if (newSurvey.title && newSurvey.targetGrade) {
      const survey: Survey = {
        id: Date.now().toString(),
        ...newSurvey,
        status: 'draft',
        responses: []
      }
      setSurveys([...surveys, survey])
      setNewSurvey({ title: '', targetGrade: '', startDate: '', endDate: '', subjects: [] })
    }
  }

  const getSubjectById = (id: string) => subjects.find(s => s.id === id)
  const getTeacherById = (id: string) => teachers.find(t => t.id === id)
  const getClassroomById = (id: string) => classrooms.find(c => c.id === id)

  const getSurveyStats = (survey: Survey) => {
    const totalStudents = survey.responses.length
    const submittedStudents = survey.responses.filter(r => r.submitted).length
    const subjectDemand = survey.subjects.map(subjectId => {
      const subject = getSubjectById(subjectId)
      const firstChoice = survey.responses.filter(r => 
        r.submitted && r.preferences.some(p => p.subjectId === subjectId && p.priority === 1)
      ).length
      return {
        subject,
        firstChoice,
        total: survey.responses.filter(r => 
          r.submitted && r.preferences.some(p => p.subjectId === subjectId)
        ).length
      }
    })
    return { totalStudents, submittedStudents, subjectDemand }
  }

  const generateTimetable = () => {
    // 간단한 시간표 생성 로직 (실제로는 더 복잡한 알고리즘 필요)
    const days = ['월', '화', '수', '목', '금']
    const periods = [1, 2, 3, 4, 5, 6, 7]
    const newTimetable: TimetableSlot[] = []
    
    days.forEach(day => {
      periods.forEach(period => {
        newTimetable.push({
          id: `${day}-${period}`,
          day,
          period,
          students: []
        })
      })
    })
    
    setTimetable(newTimetable)
  }

  const checkConflicts = () => {
    const newConflicts: string[] = []
    
    // 교사 중복 체크
    const teacherSlots: Record<string, string[]> = {}
    timetable.forEach(slot => {
      if (slot.teacher) {
        const key = `${slot.day}-${slot.period}`
        if (!teacherSlots[slot.teacher.id]) {
          teacherSlots[slot.teacher.id] = []
        }
        teacherSlots[slot.teacher.id].push(key)
      }
    })
    
    Object.entries(teacherSlots).forEach(([teacherId, slots]) => {
      if (slots.length > 1) {
        const teacher = getTeacherById(teacherId)
        newConflicts.push(`${teacher?.name} 교사가 동시에 여러 수업을 담당합니다: ${slots.join(', ')}`)
      }
    })
    
    setConflicts(newConflicts)
  }

  // Master Data Management View
  if (currentStep === 'master') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-godding-bg-primary to-godding-bg-secondary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-godding-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <ChartBarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-godding-text-primary">과목 수요 조사 관리</h1>
                  <p className="text-lg text-godding-text-secondary mt-2">
                    1단계: 기초 데이터 관리 - 과목, 교원, 강의실 정보 설정
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep('survey')}
                >
                  다음 단계: 수요 조사 생성
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Subjects Management */}
            <Card className="bg-godding-card-bg backdrop-blur-sm border-godding-card-border">
              <CardHeader>
                <CardTitle className="text-godding-text-primary flex items-center space-x-2">
                  <BookOpenIcon className="w-5 h-5" />
                  <span>과목 관리</span>
                </CardTitle>
                <CardDescription className="text-godding-text-secondary">
                  개설 가능한 모든 과목 정보를 등록하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Input
                    value={newSubject.name}
                    onChange={(e) => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="과목명"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={newSubject.category}
                      onChange={(e) => setNewSubject(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="분야"
                    />
                    <Input
                      value={newSubject.grade}
                      onChange={(e) => setNewSubject(prev => ({ ...prev, grade: e.target.value }))}
                      placeholder="학년"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      value={newSubject.credits}
                      onChange={(e) => setNewSubject(prev => ({ ...prev, credits: parseInt(e.target.value) || 0 }))}
                      placeholder="학점"
                    />
                    <Input
                      type="number"
                      value={newSubject.maxStudents}
                      onChange={(e) => setNewSubject(prev => ({ ...prev, maxStudents: parseInt(e.target.value) || 0 }))}
                      placeholder="정원"
                    />
                  </div>
                  <Textarea
                    value={newSubject.description}
                    onChange={(e) => setNewSubject(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="과목 설명"
                    rows={2}
                  />
                  <Button onClick={addSubject} className="w-full">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    과목 추가
                  </Button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="p-3 bg-white/50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-godding-text-primary">{subject.name}</h4>
                          <p className="text-sm text-godding-text-secondary">
                            {subject.category} | {subject.grade}학년 | {subject.credits}학점 | 정원 {subject.maxStudents}명
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Teachers Management */}
            <Card className="bg-godding-card-bg backdrop-blur-sm border-godding-card-border">
              <CardHeader>
                <CardTitle className="text-godding-text-primary flex items-center space-x-2">
                  <UserGroupIcon className="w-5 h-5" />
                  <span>교원 관리</span>
                </CardTitle>
                <CardDescription className="text-godding-text-secondary">
                  담당 가능 과목과 주당 시수를 설정하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Input
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="교사명"
                  />
                  <Input
                    type="number"
                    value={newTeacher.maxHours}
                    onChange={(e) => setNewTeacher(prev => ({ ...prev, maxHours: parseInt(e.target.value) || 0 }))}
                    placeholder="주당 최대 시수"
                  />
                  <Button onClick={addTeacher} className="w-full">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    교사 추가
                  </Button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {teachers.map((teacher) => (
                    <div key={teacher.id} className="p-3 bg-white/50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-godding-text-primary">{teacher.name}</h4>
                          <p className="text-sm text-godding-text-secondary">
                            최대 {teacher.maxHours}시수 | 현재 {teacher.currentHours}시수
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Classrooms Management */}
            <Card className="bg-godding-card-bg backdrop-blur-sm border-godding-card-border">
              <CardHeader>
                <CardTitle className="text-godding-text-primary flex items-center space-x-2">
                  <BuildingOfficeIcon className="w-5 h-5" />
                  <span>강의실 관리</span>
                </CardTitle>
                <CardDescription className="text-godding-text-secondary">
                  수용 인원과 특별실 여부를 설정하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Input
                    value={newClassroom.name}
                    onChange={(e) => setNewClassroom(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="강의실명"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      value={newClassroom.capacity}
                      onChange={(e) => setNewClassroom(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                      placeholder="수용 인원"
                    />
                    <select
                      value={newClassroom.type}
                      onChange={(e) => setNewClassroom(prev => ({ ...prev, type: e.target.value as any }))}
                      className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                    >
                      <option value="일반">일반</option>
                      <option value="특별실">특별실</option>
                      <option value="실험실">실험실</option>
                    </select>
                  </div>
                  <Button onClick={addClassroom} className="w-full">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    강의실 추가
                  </Button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {classrooms.map((classroom) => (
                    <div key={classroom.id} className="p-3 bg-white/50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-godding-text-primary">{classroom.name}</h4>
                          <p className="text-sm text-godding-text-secondary">
                            {classroom.type} | 수용 {classroom.capacity}명
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Survey Creation View
  if (currentStep === 'survey') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-godding-bg-primary to-godding-bg-secondary py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep('master')}
                  className="flex items-center space-x-2"
                >
                  ← 이전 단계
                </Button>
                <div className="w-12 h-12 bg-godding-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <CalendarDaysIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-godding-text-primary">수요 조사 생성</h1>
                  <p className="text-lg text-godding-text-secondary mt-2">
                    2단계: 수요 조사 생성 및 게시
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep('analysis')}
                >
                  다음 단계: 결과 분석
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create New Survey */}
            <Card className="bg-godding-card-bg backdrop-blur-sm border-godding-card-border">
              <CardHeader>
                <CardTitle className="text-godding-text-primary">새 수요 조사 생성</CardTitle>
                <CardDescription className="text-godding-text-secondary">
                  특정 학년을 대상으로 수요 조사를 생성하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-godding-text-primary mb-1">
                    조사 제목
                  </label>
                  <Input
                    value={newSurvey.title}
                    onChange={(e) => setNewSurvey(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="예: 2024학년도 2학기 3학년 과목 수요 조사"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-godding-text-primary mb-1">
                    대상 학년
                  </label>
                  <Input
                    value={newSurvey.targetGrade}
                    onChange={(e) => setNewSurvey(prev => ({ ...prev, targetGrade: e.target.value }))}
                    placeholder="예: 3학년"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-godding-text-primary mb-1">
                      조사 시작일
                    </label>
                    <Input
                      type="date"
                      value={newSurvey.startDate}
                      onChange={(e) => setNewSurvey(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-godding-text-primary mb-1">
                      조사 종료일
                    </label>
                    <Input
                      type="date"
                      value={newSurvey.endDate}
                      onChange={(e) => setNewSurvey(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-godding-text-primary mb-1">
                    선택 과목
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {subjects.map((subject) => (
                      <label key={subject.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newSurvey.subjects.includes(subject.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewSurvey(prev => ({ ...prev, subjects: [...prev.subjects, subject.id] }))
                            } else {
                              setNewSurvey(prev => ({ ...prev, subjects: prev.subjects.filter(id => id !== subject.id) }))
                            }
                          }}
                        />
                        <span className="text-sm text-godding-text-secondary">
                          {subject.name} ({subject.category}, {subject.credits}학점)
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <Button onClick={createSurvey} className="w-full">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  수요 조사 생성
                </Button>
              </CardContent>
            </Card>

            {/* Existing Surveys */}
            <Card className="bg-godding-card-bg backdrop-blur-sm border-godding-card-border">
              <CardHeader>
                <CardTitle className="text-godding-text-primary">기존 수요 조사</CardTitle>
                <CardDescription className="text-godding-text-secondary">
                  생성된 수요 조사 목록입니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {surveys.map((survey) => {
                    const stats = getSurveyStats(survey)
                    return (
                      <div key={survey.id} className="p-4 bg-white/50 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-godding-text-primary">{survey.title}</h4>
                            <p className="text-sm text-godding-text-secondary">
                              대상: {survey.targetGrade} | 기간: {survey.startDate} ~ {survey.endDate}
                            </p>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            survey.status === 'active' ? 'bg-green-100 text-green-700' :
                            survey.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {survey.status === 'active' ? '진행중' : 
                             survey.status === 'draft' ? '임시저장' : '완료'}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-godding-text-secondary">
                            {stats.submittedStudents} / {stats.totalStudents} 응답
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedSurvey(survey)
                                setCurrentStep('analysis')
                              }}
                            >
                              <EyeIcon className="w-4 h-4 mr-1" />
                              분석
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedSurvey(survey)
                                setCurrentStep('timetable')
                              }}
                            >
                              <CalendarDaysIcon className="w-4 h-4 mr-1" />
                              시간표
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Analysis Dashboard View
  if (currentStep === 'analysis' && selectedSurvey) {
    const stats = getSurveyStats(selectedSurvey)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-godding-bg-primary to-godding-bg-secondary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep('survey')}
                  className="flex items-center space-x-2"
                >
                  ← 이전 단계
                </Button>
                <div className="w-12 h-12 bg-godding-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <ChartBarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-godding-text-primary">수요 조사 결과 분석</h1>
                  <p className="text-lg text-godding-text-secondary mt-2">
                    {selectedSurvey.title}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => setCurrentStep('timetable')}
                >
                  시간표 편성으로
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Summary Stats */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="bg-godding-card-bg backdrop-blur-sm border-godding-card-border">
                <CardHeader>
                  <CardTitle className="text-godding-text-primary">응답 현황</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalStudents}</div>
                    <div className="text-sm text-godding-text-secondary">전체 학생</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.submittedStudents}</div>
                    <div className="text-sm text-godding-text-secondary">응답 완료</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{stats.totalStudents - stats.submittedStudents}</div>
                    <div className="text-sm text-godding-text-secondary">미응답</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Subject Demand Analysis */}
            <div className="lg:col-span-3">
              <Card className="bg-godding-card-bg backdrop-blur-sm border-godding-card-border">
                <CardHeader>
                  <CardTitle className="text-godding-text-primary">과목별 수요 분석</CardTitle>
                  <CardDescription className="text-godding-text-secondary">
                    과목별 신청 인원과 1순위 선택 비율을 확인하세요
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.subjectDemand.map(({ subject, firstChoice, total }) => (
                      <div key={subject?.id} className="p-4 bg-white/50 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-godding-text-primary">{subject?.name}</h4>
                            <p className="text-sm text-godding-text-secondary">
                              {subject?.category} | {subject?.credits}학점 | 정원 {subject?.maxStudents}명
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-godding-text-primary">{total}명</div>
                            <div className="text-sm text-godding-text-secondary">신청</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-godding-text-secondary">1순위 선택</span>
                            <span className="font-medium text-godding-text-primary">{firstChoice}명</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-godding-primary h-2 rounded-full" 
                              style={{ width: `${(firstChoice / total) * 100}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-godding-text-secondary">정원 대비</span>
                            <span className={`font-medium ${total > (subject?.maxStudents || 0) ? 'text-red-600' : 'text-green-600'}`}>
                              {total} / {subject?.maxStudents}명
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Timetable Simulator View
  if (currentStep === 'timetable' && selectedSurvey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-godding-bg-primary to-godding-bg-secondary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep('analysis')}
                  className="flex items-center space-x-2"
                >
                  ← 이전 단계
                </Button>
                <div className="w-12 h-12 bg-godding-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <CalendarDaysIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-godding-text-primary">시간표 편성 시뮬레이터</h1>
                  <p className="text-lg text-godding-text-secondary mt-2">
                    {selectedSurvey.title} - 시간표 편성 및 충돌 검사
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={generateTimetable}>
                  <ArrowPathIcon className="w-4 h-4 mr-2" />
                  시간표 생성
                </Button>
                <Button variant="outline" onClick={checkConflicts}>
                  <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                  충돌 검사
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Conflicts Panel */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="bg-godding-card-bg backdrop-blur-sm border-godding-card-border">
                <CardHeader>
                  <CardTitle className="text-godding-text-primary flex items-center space-x-2">
                    <ExclamationTriangleIcon className="w-5 h-5" />
                    <span>충돌 알림</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {conflicts.length > 0 ? (
                    <div className="space-y-2">
                      {conflicts.map((conflict, index) => (
                        <div key={index} className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                          {conflict}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-4 text-godding-text-secondary">
                      <CheckCircleIcon className="w-8 h-8 mx-auto mb-2 text-green-500" />
                      <p>충돌이 없습니다</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-godding-card-bg backdrop-blur-sm border-godding-card-border">
                <CardHeader>
                  <CardTitle className="text-godding-text-primary">미편성 현황</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-godding-text-secondary">
                      미배정 과목: {selectedSurvey.subjects.length}개
                    </div>
                    <div className="text-sm text-godding-text-secondary">
                      미배정 교사: {teachers.length}명
                    </div>
                    <div className="text-sm text-godding-text-secondary">
                      미배정 강의실: {classrooms.length}개
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timetable Grid */}
            <div className="lg:col-span-3">
              <Card className="bg-godding-card-bg backdrop-blur-sm border-godding-card-border">
                <CardHeader>
                  <CardTitle className="text-godding-text-primary">시간표 그리드</CardTitle>
                  <CardDescription className="text-godding-text-secondary">
                    드래그 앤 드롭으로 과목을 배치하세요
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border border-gray-300 p-2 bg-gray-50 text-godding-text-primary">시간</th>
                          {['월', '화', '수', '목', '금'].map(day => (
                            <th key={day} className="border border-gray-300 p-2 bg-gray-50 text-godding-text-primary">
                              {day}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3, 4, 5, 6, 7].map(period => (
                          <tr key={period}>
                            <td className="border border-gray-300 p-2 bg-gray-50 text-godding-text-primary font-medium">
                              {period}교시
                            </td>
                            {['월', '화', '수', '목', '금'].map(day => {
                              const slot = timetable.find(s => s.day === day && s.period === period)
                              return (
                                <td key={`${day}-${period}`} className="border border-gray-300 p-2 min-w-[120px] h-16 bg-white hover:bg-gray-50 cursor-pointer">
                                  {slot?.subject ? (
                                    <div className="p-2 bg-godding-primary text-white rounded text-xs">
                                      <div className="font-medium">{slot.subject.name}</div>
                                      <div className="text-xs opacity-80">
                                        {slot.teacher?.name} | {slot.classroom?.name}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-gray-400 text-xs">빈 시간</div>
                                  )}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default view - redirect to master data
  return (
    <div className="min-h-screen bg-gradient-to-br from-godding-bg-primary to-godding-bg-secondary py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-20 h-20 bg-godding-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
          <ChartBarIcon className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-godding-text-primary mb-4">
          과목 수요 조사 관리
        </h1>
        <p className="text-xl text-godding-text-secondary mb-8">
          3단계 프로세스로 체계적인 과목 수요 조사와 시간표 편성을 진행하세요
        </p>
        <Button 
          onClick={() => setCurrentStep('master')}
          size="lg"
          className="text-lg px-8 py-4"
        >
          시작하기
        </Button>
      </div>
    </div>
  )
}