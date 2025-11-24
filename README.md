# StockCal  
提示美股财报日期的专业工具  
*StockCal – U.S. Earnings-Date Reminder Tool*

---

## 🧩 项目简介（中文）

StockCal 是一个专注于美股（U.S. equities）**财报发布日期提醒**的工具／应用，旨在帮助用户快速了解即将公布财报的公司，辅助选股、事件驱动策略、投资研究。

### ✔ 核心功能  
- 自动获取即将公布财报的美股公司名单、发布日期、预计 EPS 等关键信息  
- 提醒用户哪些公司即将发布财报，方便做事件驱动投资判断  
- UI 前端展示列表、过滤、搜索功能（基于 TypeScript、Vite 等）  
- 可扩展：加入邮件提醒、日历同步、API 接口  

### ✔ 适用场景  
- 股票投研人员需关注公司财报日  
- 量化交易做事件驱动策略的研究员/工程师  
- 私募／基金／散户做“财报窗口期”交易  
- 经济学／金融学学生在简历中展示“数据 + 应用”能力  

---

## 🧩 Project Introduction (English)

StockCal is a tool focused on U.S. equities **earnings-date reminders**, designed to help users quickly identify companies about to report earnings—supporting stock selection, event-driven strategies and investment research.

### ✔ Key Features  
- Automatically fetches upcoming earnings announcements for U.S. listed companies: dates, EPS estimates, etc.  
- Alerts users to companies about to report earnings—helping event-driven investment decisions.  
- UI frontend for listing, filtering, searching (built with TypeScript, Vite, etc.).  
- Extensible: email notifications, calendar integration, API endpoints.

### ✔ Use Cases  
- Research analysts tracking earnings-date calendars.  
- Quant/engineers building event-driven trading systems.  
- Hedge funds / investment funds / retail traders focusing on earnings windows.  
- Economics/finance students showcasing “data + application” skills in their portfolio.

---

## 📊 数据来源 (Data Sources)  
- 美股上市公司公告／财报日历网站、开放 API  
- 财报预期数据（EPS estimates）  
- 若被扩展：历史财报日、实际 EPS 数据  

---

## 🛠 技术栈 (Tech Stack)  
- TypeScript  
- Vite／前端框架 (React / Vue)  
- Node.js (如需后端/API)  
- 前端 UI 组件库（例如 Ant Design、Material-UI）  
- 可选：数据库或云服务（用于提醒日志）  

---

## 🚀 快速开始 (Quick Start)  
```bash
git clone https://github.com/awawa-max/StockCal.git
cd StockCal
npm install
npm run dev
