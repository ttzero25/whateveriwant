import {setupRoboticsArchive} from './robotics-archive.js';
import {createResearchWatch} from './research.js';
export const {renderResearch:renderRobotics}=createResearchWatch({
 setupArchive:setupRoboticsArchive,
 route:'#/robotics-security',file:'./robotics-security.json',
 title:'ROS & Autonomous Security Watch',
 description:['ROS·ROS 2와 자율주행 보안 소식, 로봇 미들웨어·차량·센서 보안 연구를 원문으로 이어 읽어보세요.','Follow ROS, ROS 2 and autonomous driving security through community updates and original research.'],
 search:['제목·요약 검색: ROS 2, DDS, LiDAR, vehicle…','Search titles and summaries: ROS 2, DDS, LiDAR, vehicle…'],
 labels:{ros:['ROS·미들웨어','ROS & middleware'],autonomy:['자율주행·차량','Autonomous vehicles'],sensors:['센서·인지','Sensors & perception'],security:['보안 연구','Security research']}
});
