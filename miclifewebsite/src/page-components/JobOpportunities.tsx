import { useState, useEffect } from "react";
import { Card, Input, Select, Button, Tag, Row, Col, Typography, Modal, Form, Upload, message, Pagination } from "antd";
import {
  SearchOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  UploadOutlined,
  RightOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { SendEmail } from "../lib/api/ApiCalls";
import colorscm from "../shared/constants/colorscm";

const { Title, Text } = Typography;
const { Option } = Select;

const JobOpportunities = () => {
  const { t } = useTranslation();
  const { direction, language } = useSelector((state: any) => state.language);
  const [searchText, setSearchText] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Test data - Replace with API calls later
  const [jobs] = useState([
    {
      id: 1,
      enTitle: "Senior Software Engineer",
      arTitle: "مهندس برمجيات كبير",
      enDepartment: "IT",
      arDepartment: "تكنولوجيا المعلومات",
      enLocation: "Cairo",
      arLocation: "القاهرة",
      enType: "Full-time",
      arType: "دوام كامل",
      enSalary: "Competitive",
      arSalary: "تنافسي",
      enDescription: "We are looking for an experienced software engineer to join our team...",
      arDescription: "نبحث عن مهندس برمجيات ذو خبرة للانضمام إلى فريقنا...",
      enRequirements: ["5+ years experience", "React", "Node.js", "TypeScript"],
      arRequirements: ["خبرة 5+ سنوات", "React", "Node.js", "TypeScript"],
      postedDate: "2024-03-15",
    },
    {
      id: 2,
      enTitle: "Insurance Claims Specialist",
      arTitle: "متخصص مطالبات التأمين",
      enDepartment: "Claims",
      arDepartment: "المطالبات",
      enLocation: "Alexandria",
      arLocation: "الإسكندرية",
      enType: "Full-time",
      arType: "دوام كامل",
      enSalary: "Competitive",
      arSalary: "تنافسي",
      enDescription: "Join our claims team to help process and manage insurance claims...",
      arDescription: "انضم إلى فريق المطالبات لدينا للمساعدة في معالجة وإدارة مطالبات التأمين...",
      enRequirements: ["3+ years experience", "Insurance background", "Customer service"],
      arRequirements: ["خبرة 3+ سنوات", "خلفية تأمينية", "خدمة العملاء"],
      postedDate: "2024-03-14",
    },
    {
      id: 3,
      enTitle: "Marketing Manager",
      arTitle: "مدير التسويق",
      enDepartment: "Marketing",
      arDepartment: "التسويق",
      enLocation: "Cairo",
      arLocation: "القاهرة",
      enType: "Full-time",
      arType: "دوام كامل",
      enSalary: "Competitive",
      arSalary: "تنافسي",
      enDescription: "Lead our marketing initiatives and drive brand growth...",
      arDescription: "قيادة مبادراتنا التسويقية وتعزيز نمو العلامة التجارية...",
      enRequirements: ["5+ years experience", "Digital marketing", "Team leadership"],
      arRequirements: ["خبرة 5+ سنوات", "التسويق الرقمي", "قيادة الفريق"],
      postedDate: "2024-03-13",
    },
  ]);

  // Test data for departments - Replace with API calls later
  const [departments] = useState([
    { id: 1, enName: "IT", arName: "تكنولوجيا المعلومات" },
    { id: 2, enName: "Claims", arName: "المطالبات" },
    { id: 3, enName: "Marketing", arName: "التسويق" },
  ]);

  // Test data for locations - Replace with API calls later
  const [locations] = useState([
    { id: 1, enName: "Cairo", arName: "القاهرة" },
    { id: 2, enName: "Alexandria", arName: "الإسكندرية" },
  ]);

  // Filter jobs based on search and filters
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job[`${language}Title` as keyof typeof job]?.toString().toLowerCase().includes(searchText.toLowerCase()) ||
      job[`${language}Description` as keyof typeof job]?.toString().toLowerCase().includes(searchText.toLowerCase());
    const matchesDepartment = !selectedDepartment || job[`${language}Department` as keyof typeof job] === selectedDepartment;
    const matchesLocation = !selectedLocation || job[`${language}Location` as keyof typeof job] === selectedLocation;
    return matchesSearch && matchesDepartment && matchesLocation;
  });

  // Calculate pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: (document.querySelector(".job-listings") as HTMLElement)?.offsetTop - 100,
      behavior: "smooth",
    });
  };

  const handleApply = (job: any) => {
    setSelectedJob(job);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setSelectedJob(null);
  };

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();

      const body = `
        New Job Application:
        
        Position: ${selectedJob?.[`${language}Title`]}
        Department: ${selectedJob?.[`${language}Department`]}
        
        Applicant Details:
        First Name: ${values.firstName}
        Last Name: ${values.lastName}
        Email: ${values.email}
        Phone: ${values.phone}
        
        CV: ${values.cv[0]?.name || "Not provided"}
      `;

      formData.append("Body", body);
      formData.append("Subject", `Job Application - ${selectedJob?.[`${language}Title`]}`);
      formData.append("toEmails", "omar.alsayed@mohinspro.com");
      formData.append("CCEmails", "");
      formData.append("BCCEmails", "");

      if (values.cv) {
        values.cv.forEach((file: any) => {
          formData.append("Attachments", file.originFileObj);
        });
      }

      await SendEmail(formData);
      message.success(t("jobs.applicationSubmittedSuccessfully"));
      handleCancel();
    } catch (error) {
      console.error("Error submitting application:", error);
      message.error(t("jobs.applicationSubmissionFailed"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8" dir={direction}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <Title level={2} className="text-3xl md:text-4xl font-bold text-gray-800">
            {t("jobs.title")}
          </Title>
          <Text className="text-lg text-gray-600">{t("jobs.subtitle")}</Text>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <Row gutter={[16, 16]} className="items-end">
            <Col xs={24} md={8}>
              <Input
                placeholder={t("jobs.searchPlaceholder")}
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                size="large"
                className="w-full"
              />
            </Col>
            <Col xs={24} md={8}>
              <Select
                placeholder={t("jobs.department")}
                value={selectedDepartment}
                onChange={setSelectedDepartment}
                size="large"
                className="w-full"
                allowClear
              >
                {departments.map((dept) => (
                  <Option key={dept.id} value={dept[`${language}Name` as keyof typeof dept]}>
                    {dept[`${language}Name` as keyof typeof dept]}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} md={8}>
              <Select
                placeholder={t("jobs.location")}
                value={selectedLocation}
                onChange={setSelectedLocation}
                size="large"
                className="w-full"
                allowClear
              >
                {locations.map((loc) => (
                  <Option key={loc.id} value={loc[`${language}Name` as keyof typeof loc]}>
                    {loc[`${language}Name` as keyof typeof loc]}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
        </div>

        {/* Job Listings */}
        <div className="space-y-6 job-listings">
          {currentJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow duration-300" >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <Title level={4} className="text-xl font-semibold text-gray-800 mb-2">
                    {job[`${language}Title` as keyof typeof job]}
                  </Title>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Tag color="blue" className="flex items-center gap-1">
                      <EnvironmentOutlined /> {job[`${language}Location` as keyof typeof job]}
                    </Tag>
                    <Tag color="green" className="flex items-center gap-1">
                      <ClockCircleOutlined /> {job[`${language}Type` as keyof typeof job]}
                    </Tag>
                    <Tag color="purple" className="flex items-center gap-1">
                      <DollarOutlined /> {job[`${language}Salary` as keyof typeof job]}
                    </Tag>
                  </div>
                  <Text className="text-gray-600 block mb-4">{job[`${language}Description` as keyof typeof job]}</Text>
                  <div className="flex flex-wrap gap-2">
                    {(job[`${language}Requirements` as keyof typeof job] as any)?.map((req: any, index: number) => (
                        <Tag key={index} color="default">
                          {req}
                        </Tag>
                      )) as any
                    }
                  </div>
                </div>
                <Button type="primary" size="large" className="whitespace-nowrap text-white self-end lg:self-center" style={{ backgroundColor: colorscm.orange }} onClick={() => handleApply(job)}>
                  {t("jobs.applyNow")}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {filteredJobs.length > 0 && (
          <div className="flex justify-center mt-8">
            <Pagination
              current={currentPage}
              total={filteredJobs.length}
              pageSize={jobsPerPage}
              onChange={handlePageChange}
              showSizeChanger={false}
              showTotal={(total, range) =>
                `${t("jobs.pagination.showing")} ${range[0]}-${range[1]} ${t("jobs.pagination.of")} ${total} ${t(
                  "jobs.pagination.jobs"
                )}`
              }
              className="bg-white p-4 rounded-lg shadow-sm"
              itemRender={(page, type, originalElement) => {
                if (type === "prev") {
                  return <Button type="link" icon={direction === "rtl" ? <RightOutlined /> : <LeftOutlined />} />;
                }
                if (type === "next") {
                  return <Button type="link" icon={direction === "rtl" ? <LeftOutlined /> : <RightOutlined />} />;
                }
                return originalElement;
              }}
            />
          </div>
        )}

        {/* No Results Message */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Title level={4} className="text-gray-600">
              {t("jobs.noJobsFound")}
            </Title>
            <Button
              type="link"
              onClick={() => {
                setSearchText("");
                setSelectedDepartment(null);
                setSelectedLocation(null);
                setCurrentPage(1);
              }}
            >
              {t("jobs.clearFilters")}
            </Button>
          </div>
        )}

        {/* Application Modal */}
        <Modal
          title={`${t("jobs.applyFor")} ${selectedJob?.[`${language}Title`] || ""}`}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={600}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="firstName"
                  label={t("jobs.firstName")}
                  rules={[
                    {
                      required: true,
                      message: t("jobs.validation.firstNameRequired"),
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="lastName"
                  label={t("jobs.lastName")}
                  rules={[
                    {
                      required: true,
                      message: t("jobs.validation.lastNameRequired"),
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="email"
                  label={t("jobs.email")}
                  rules={[
                    {
                      required: true,
                      message: t("jobs.validation.emailRequired"),
                    },
                    {
                      type: "email",
                      message: t("jobs.validation.emailInvalid"),
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="phone"
                  label={t("jobs.phone")}
                  rules={[
                    {
                      required: true,
                      message: t("jobs.validation.phoneRequired"),
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="cv"
              label={t("jobs.cv")}
              rules={[{ required: true, message: t("jobs.validation.cvRequired") }]}
            >
              <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.doc,.docx">
                <Button icon={<UploadOutlined />}>{t("jobs.uploadCV")}</Button>
              </Upload>
            </Form.Item>

            <Form.Item className="mb-0 text-right">
              <Button type="default" onClick={handleCancel} className="mr-2">
                {t("jobs.cancel")}
              </Button>
              <Button type="primary" htmlType="submit">
                {t("jobs.submitApplication")}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default JobOpportunities;
