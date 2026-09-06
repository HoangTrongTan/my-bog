export interface TechKnowledgeArticle {
  id: string;
  title: string;
  category: 'aws' | 'docker-k8s' | 'deployment';
  categoryLabel: string;
  summary: string;
  readTime: string;
  level: 'Cơ Bản' | 'Trung Cấp' | 'Nâng Cao';
  icon: string;
  tags: string[];
  lastUpdated: string;
  contentHtml: string;
  architectureDiagramSvg?: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export const TECH_KNOWLEDGE_ARTICLES: TechKnowledgeArticle[] = [
  {
    id: 'aws-vpc-networking-architecture',
    title: 'AWS VPC & Networking Architecture: Từ VPC, Subnet đến Security Groups & Peering',
    category: 'aws',
    categoryLabel: 'AWS Cloud',
    summary: 'Hướng dẫn toàn diện về thiết kế mạng bảo mật trên AWS: VPC, Public/Private Subnets, Internet Gateway, NAT Gateway, Route Tables, Security Groups, NACLs & VPC Peering.',
    readTime: '12 phút',
    level: 'Nâng Cao',
    icon: 'hub',
    tags: ['AWS', 'VPC', 'Subnet', 'NAT Gateway', 'Security Group', 'VPC Peering', 'Networking'],
    lastUpdated: '2026-09-06',
    codeSnippet: {
      language: 'bash',
      code: `# Kiểm tra bảng tuyến đường (Route Table) trên AWS CLI
aws ec2 describe-route-tables --filters "Name=vpc-id,Values=vpc-0a1b2c3d4e5f"

# Kiểm tra Security Group Inbound Rules
aws ec2 describe-security-groups --group-ids sg-0123456789abcdef0`
    },
    contentHtml: `
      <h3>1. Tổng Quan Kiến Trúc Amazon VPC (Virtual Private Cloud)</h3>
      <p>Virtual Private Cloud (VPC) là mạng ảo cách ly hoàn toàn trên nền tảng AWS Cloud, cho phép bạn khởi tạo các tài nguyên AWS trong một mạng logic tùy chỉnh.</p>
      
      <h4>Các Thành Phần Cốt Lõi:</h4>
      <ul>
        <li><strong>VPC CIDR Block:</strong> Dải địa chỉ IP nội bộ (ví dụ: <code>10.0.0.0/16</code> cung cấp 65,536 địa chỉ IP).</li>
        <li><strong>Public Subnet:</strong> Subnet có tuyến đường trực tiếp ra Internet qua Internet Gateway (IGW). Thường chứa Application Load Balancers (ALB), Bastion Hosts.</li>
        <li><strong>Private Subnet:</strong> Subnet hoàn toàn không tiếp xúc trực tiếp với Internet. Chứa Backend APIs (ASP.NET Core / Node.js), Microservices, Databases.</li>
        <li><strong>Internet Gateway (IGW):</strong> Cổng kết nối 2 chiều giữa VPC và Internet.</li>
        <li><strong>NAT Gateway:</strong> Cho phép tài nguyên trong Private Subnet tải update/packages từ Internet nhưng ngăn Internet chủ động kết nối vào.</li>
        <li><strong>Route Tables (Bảng tuyến đường):</strong> Chứa tập hợp các quy tắc (Routes) định hướng lưu lượng mạng từ Subnet đến IGW, NAT Gateway, hoặc Peering Connection.</li>
      </ul>

      <h3>2. Phân Biệt Security Groups & NACLs (Network Access Control Lists)</h3>
      <table class="w-full border-collapse border border-slate-700 my-4 text-sm">
        <thead>
          <tr class="bg-slate-800 text-theme-accent">
            <th class="p-2 border border-slate-700">Đặc tính</th>
            <th class="p-2 border border-slate-700">Security Group (SG)</th>
            <th class="p-2 border border-slate-700">Network ACL (NACL)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="p-2 border border-slate-700 font-semibold">Cấp độ áp dụng</td>
            <td class="p-2 border border-slate-700">Cấp Instance / ENI (Network Interface)</td>
            <td class="p-2 border border-slate-700">Cấp Subnet</td>
          </tr>
          <tr>
            <td class="p-2 border border-slate-700 font-semibold">Trạng thái (State)</td>
            <td class="p-2 border border-slate-700">Stateful (Inbound mở -> Outbound tự động mở)</td>
            <td class="p-2 border border-slate-700">Stateless (Phải cấu hình riêng Inbound & Outbound)</td>
          </tr>
          <tr>
            <td class="p-2 border border-slate-700 font-semibold">Quy tắc (Rules)</td>
            <td class="p-2 border border-slate-700">Chỉ hỗ trợ ALLOW (Mặc định Deny All)</td>
            <td class="p-2 border border-slate-700">Hỗ trợ cả ALLOW và DENY theo thứ tự số hiệu</td>
          </tr>
        </tbody>
      </table>

      <h3>3. Kết Nối 2 VPC với VPC Peering</h3>
      <p>VPC Peering kết nối 2 VPC riêng biệt (trong cùng Region hoặc Cross-Region) thông qua mạng nội bộ AWS với độ trễ cực thấp và băng thông cao mà không thông qua Internet công cộng.</p>
    `
  },
  {
    id: 'aws-ec2-dynamodb-deep-dive',
    title: 'Amazon EC2 & DynamoDB NoSQL Masterclass: Tối Ưu Hiệu Năng & Khả Năng Mở Rộng',
    category: 'aws',
    categoryLabel: 'AWS Cloud',
    summary: 'Tìm hiểu sâu về tính toán EC2 Auto-Scaling, Elastic Load Balancer (ALB) và thiết kế NoSQL DynamoDB với Partition Keys, Global Secondary Indexes (GSI).',
    readTime: '10 phút',
    level: 'Trung Cấp',
    icon: 'dns',
    tags: ['AWS', 'EC2', 'DynamoDB', 'NoSQL', 'ALB', 'Auto Scaling'],
    lastUpdated: '2026-09-06',
    codeSnippet: {
      language: 'typescript',
      code: `// DynamoDB Query với GSI trong TypeScript AWS SDK v3
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "ap-southeast-1" });
const command = new QueryCommand({
  TableName: "UserProfiles",
  IndexName: "EmailIndex",
  KeyConditionExpression: "email = :v_email",
  ExpressionAttributeValues: {
    ":v_email": { S: "tan@enterprisenao.com" }
  }
});
const response = await client.send(command);`
    },
    contentHtml: `
      <h3>1. Amazon EC2 & Auto Scaling Architecture</h3>
      <p>Amazon Elastic Compute Cloud (EC2) cung cấp năng lực máy chủ ảo linh hoạt. Kết hợp với Target Tracking Auto Scaling và Application Load Balancer (ALB), ứng dụng có thể tự động tăng giảm số lượng instance dựa trên chỉ số CPU Utilisation hoặc Request Count Per Target.</p>
      
      <h3>2. DynamoDB Design Strategy (Single-Table Design)</h3>
      <p>DynamoDB là dịch vụ cơ sở dữ liệu NoSQL Serverless độ trễ mili-giây ở mọi quy mô scale.</p>
      <ul>
        <li><strong>Partition Key (PK):</strong> Xác định partition vật lý chứa dữ liệu.</li>
        <li><strong>Sort Key (SK):</strong> Sắp xếp dữ liệu trong cùng một Partition Key, hỗ trợ truy vấn phạm vi (<code>begins_with</code>, <code>between</code>).</li>
        <li><strong>Global Secondary Index (GSI):</strong> Tạo chỉ mục tùy chỉnh với PK/SK khác với bảng gốc để hỗ trợ các mẫu truy vấn phụ.</li>
        <li><strong>Capacity Modes:</strong> <code>Provisioned</code> (dự trù trước RCU/WCU) vs <code>On-Demand</code> (tự động scale theo lưu lượng thực tế).</li>
      </ul>
    `
  },
  {
    id: 'docker-kubernetes-production-guide',
    title: 'Docker & Kubernetes (K8s) Production Architecture: Từ Multi-Stage Container đến K8s Cluster',
    category: 'docker-k8s',
    categoryLabel: 'Docker & K8s',
    summary: 'Chuẩn hóa quy trình đóng gói ứng dụng với Multi-Stage Dockerfile tối ưu dung lượng image và quản trị Container Orchestration trên Kubernetes Cluster (Pods, Deployments, Services, Ingress).',
    readTime: '15 phút',
    level: 'Nâng Cao',
    icon: 'layers',
    tags: ['Docker', 'Kubernetes', 'K8s', 'Containers', 'Ingress', 'Fargate'],
    lastUpdated: '2026-09-06',
    codeSnippet: {
      language: 'yaml',
      code: `# Kubernetes Deployment Manifest chuẩn Production
apiVersion: apps/v1
kind: Deployment
metadata:
  name: angular-portfolio-deployment
  labels:
    app: angular-portfolio
spec:
  replicas: 3
  selector:
    matchLabels:
      app: angular-portfolio
  template:
    metadata:
      labels:
        app: angular-portfolio
    spec:
      containers:
      - name: angular-container
        image: 123456789.dkr.ecr.ap-southeast-1.amazonaws.com/portfolio:latest
        ports:
        - containerPort: 80
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
          requests:
            cpu: "250m"
            memory: "256Mi"`
    },
    contentHtml: `
      <h3>1. Multi-Stage Dockerfile Cho Angular & ASP.NET Core</h3>
      <p>Việc sử dụng Multi-Stage Build trong Dockerfile giúp giảm dung lượng Image từ 1.2GB xuống dưới 40MB bằng cách chỉ giữ lại các file compiled artifact chạy trong Nginx / Alpine Linux runner.</p>

      <h3>2. Các Đối Tượng Cốt Lõi Trong Kubernetes (K8s)</h3>
      <ul>
        <li><strong>Pod:</strong> Đơn vị chạy nhỏ nhất chứa 1 hoặc nhiều container chia sẻ chung Network Namespace và Volume.</li>
        <li><strong>Deployment:</strong> Quản lý khai báo trạng thái mong muốn (Desired State), tự động cuộn (Rolling Updates) và khôi phục khi Pod bị crash (Self-Healing).</li>
        <li><strong>Service:</strong> Lớp trừu tượng mạng định tuyến lưu lượng truy cập:
          <ul>
            <li><code>ClusterIP:</code> IP nội bộ chỉ truy cập trong cluster.</li>
            <li><code>NodePort:</code> Mở port trực tiếp trên từng worker node.</li>
            <li><code>LoadBalancer:</code> Tự động tích hợp Cloud Load Balancer (AWS ALB/NLB).</li>
          </ul>
        </li>
        <li><strong>Ingress Controller:</strong> Quản lý Routing HTTP/HTTPS Nginx Ingress hoặc AWS ALB Ingress Controller cấp độ Layer 7.</li>
      </ul>
    `
  },
  {
    id: 'deploy-aspnet-angular-aws-ecs-fargate',
    title: 'Triển Khai Full-Stack ASP.NET Core & Angular lên AWS ECS Fargate với CI/CD Pipeline',
    category: 'deployment',
    categoryLabel: 'Deployment & CI/CD',
    summary: 'Hướng dẫn từng bước triển khai ứng dụng Full-Stack (Backend ASP.NET Core + Frontend Angular) container hóa lên Amazon ECS Fargate Serverless Cluster kết hợp ECR và ALB.',
    readTime: '18 phút',
    level: 'Nâng Cao',
    icon: 'cloud_upload',
    tags: ['AWS ECS', 'Fargate', 'ASP.NET Core', 'Angular', 'ECR', 'ALB', 'CI/CD'],
    lastUpdated: '2026-09-06',
    codeSnippet: {
      language: 'json',
      code: `// AWS ECS Task Definition snippet (Fargate Launch Type)
{
  "family": "enterprisenao-task-def",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "backend-api",
      "image": "123456789.dkr.ecr.ap-southeast-1.amazonaws.com/landbase-api:v1.0.0",
      "essential": true,
      "portMappings": [
        { "containerPort": 5000, "hostPort": 5000, "protocol": "tcp" }
      ]
    }
  ]
}`
    },
    contentHtml: `
      <h3>1. Tổng Quan Mô Hình AWS ECS Fargate Serverless</h3>
      <p>Amazon Elastic Container Service (ECS) Fargate cho phép bạn chạy các Docker container mà không cần phải quản lý hay nâng cấp các cụm EC2 instance bên dưới.</p>

      <h3>2. Quy Trình 5 Bước Triển Khai Thực Tế:</h3>
      <ol class="list-decimal pl-6 space-y-2 my-3">
        <li><strong>Đóng gói Image & Push lên Amazon ECR:</strong> Biên dịch ứng dụng ASP.NET Core & Angular thành Docker Images và push lên Amazon Elastic Container Registry (ECR).</li>
        <li><strong>Tạo ECS Task Definition:</strong> Định nghĩa thông số CPU, RAM, Environment Variables, IAM Execution Roles và Log Groups (CloudWatch Logs).</li>
        <li><strong>Cấu Hình Target Groups & ALB:</strong> Cấu hình Application Load Balancer (ALB) định tuyến đường dẫn <code>/api/*</code> đến Backend Container và <code>/*</code> đến Frontend Angular Container.</li>
        <li><strong>Khởi Tạo ECS Service:</strong> Chọn Launch Type là <code>FARGATE</code>, chỉ định Private Subnets và Security Group mở port 5000 / 80.</li>
        <li><strong>Tự Động Hóa CI/CD:</strong> Tích hợp GitHub Actions workflow tự động build, test và phát hành bản cập nhật mới (Rolling Update) lên ECS Cluster mà không gián đoạn dịch vụ (Zero Downtime Deployment).</li>
      </ol>
    `
  }
];
