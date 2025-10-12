// import {Fragment, memo} from 'react';
// import {MegaMenu, MegaMenuContainer, MegaMenuList} from "@/components/MegaMenu/MegaMenu";
//
// const MegaMenuTest = (props) => {
//     return (
//         <Fragment>
//             {/*<div style={{marginBottom:'40px'}}>*/}
//             {/*    <NaviMenu title={"default use"} data={data}/>*/}
//             {/*</div>*/}
//
//             <div>
//                 <MegaMenu container={<MegaMenuContainer leftItems={[<div>로드아이즈 2.0</div>]}
//                                                     centerItems={[<MegaMenuList data={data}/>]}
//                                                     rightItems={[<div>홍길동님 2022-01-01 12:32:21</div>]}/>}
//                 />
//             </div>
//         </Fragment>
//     )
// }
// export default memo(MegaMenuTest);
//
// const data = [
//     {
//         title: '스마트교차로',
//         url: '',
//         subMenu: [{title: '교차로버드아이뷰', url: '', subMenu: []},
//             {
//                 title: '교차로통계분석', url: '', subMenu: [{
//                     title: '교차로 종합통계',
//                     url: '',
//                     subMenu: []
//                 },
//                     {
//                         title: '교차로 비교/분석',
//                         url: '',
//                         subMenu: []
//                     }]
//             },
//             {
//                 title: 'LOS 분석', url: '', subMenu: [{
//                     title: '분석 시뮬레이션',
//                     url: '',
//                     subMenu: []
//                 },
//                     {
//                         title: '분석 이력 조회',
//                         url: '',
//                         subMenu: []
//                     }]
//             }
//         ]
//     },
//     {
//         title: '영상검지기',
//         url: '',
//         subMenu: [{title: '영상검지기 상세', url: '', subMenu: []},
//             {
//                 title: '영상검지기 통계', url: '', subMenu: [{
//                     title: '영상검지기 종합통계',
//                     url: '',
//                     subMenu: []
//                 },
//                     {
//                         title: '영상검지기 비교/분석',
//                         url: '',
//                         subMenu: []
//                     }]
//             }
//         ]
//     },
//
//     {
//         title: 'VOD 관리',
//         url: '',
//         subMenu: [{title: '돌발 이벤트 VOD 조회', url: '', subMenu: []},
//             {title: '상시 VOD 조회', url: '', subMenu: []},
//             {title: 'VOD 설정', url: '', subMenu: []}]
//     },
//     {
//         title: '등록 설정 관리',
//         url: '',
//         subMenu: [{
//             title: '카메라 관리', url: '', subMenu: [{
//                 title: '카메라 정보 관리',
//                 url: '',
//                 subMenu: []
//             },
//                 {
//                     title: '분석 유형 프리셋 관리',
//                     url: '',
//                     subMenu: []
//                 }, {
//                     title: '분석 유형 설정',
//                     url: '',
//                     subMenu: []
//                 },
//                 {
//                     title: '트렌젝션 관리',
//                     url: '',
//                     subMenu: []
//                 }]
//         },
//             {
//                 title: '관제 대상 정보 관리', url: '', subMenu: [{
//                     title: '교통축 정보 관리',
//                     url: '',
//                     subMenu: []
//                 },
//                     {
//                         title: '교차로 정보 관리',
//                         url: '',
//                         subMenu: []
//                     }, {
//                         title: 'LOS 기본 정보 관리',
//                         url: '',
//                         subMenu: []
//                     }]
//             },
//             {title: '관제 기준 설정', url: '', subMenu: []},
//             {title: '공휴일 관리', url: '', subMenu: []}]
//     },
//     {
//         title: '시스템 관리',
//         url: '',
//         subMenu: [{
//             title: '시스템 관리', url: '', subMenu: [{
//                 title: '시스템 상태 정보',
//                 url: '',
//                 subMenu: []
//             },
//                 {
//                     title: '분석 엔진 관리',
//                     url: '',
//                     subMenu: []
//                 }]
//         },
//             {
//                 title: '사용자 관리', url: '', subMenu: [{
//                     title: '사용자 계정 관리',
//                     url: '',
//                     subMenu: []
//                 }]
//             }]
//     },
// ]