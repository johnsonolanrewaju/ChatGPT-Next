import { Alert, Col, message, Modal, Row, Tooltip } from "antd";
import { useCallback, useContext, useEffect, useState } from "react";
import { AppStore } from "@/store/App";
import Button from "@/components/Button";
import { UserStore } from "@/store/User";
import copyToClipboard from "@/utils/copyToClipboard";
import http from "@/service/http";
import { useRouter } from "next/router";

interface Props {
    open: boolean;
    onCancel: () => void;
}

const Setting: React.FC<Props> = ({ open, onCancel }) => {
    const [editToken, setEditToken] = useState(false);
    const { token, setData } = useContext(AppStore);
    const { userInfo } = useContext(UserStore);
    const router = useRouter();
    const [notice, setNotice] = useState("");

    const initNotice = useCallback(async () => {
        const data = await http.getNotice();
        setNotice(data);
    }, []);

    useEffect(() => {
        initNotice();
    }, []);

    const onSaveToken = (e: string) => {
        if (!e.trim()) {
            setEditToken(false);
            return;
        }
        setData({ token: e });
        setEditToken(false);
    };

    const onCopyInviteUrl = async () => {
        const url = location.origin + "/login?code=" + userInfo.inviteCode;
        try {
            await copyToClipboard(url);
            message.success("复制成功");
        } catch (error) {
            message.error("复制失败");
        }
    };

    const onLogout = async () => {
        await http.logout();
        router.replace("/login");
    };

    return (
        <Modal
            title="设置"
            open={open}
            onCancel={onCancel}
            maskClosable={false}
            cancelText="取消"
            okText="保存"
            footer={null}
            width={600}
        >
            {notice && <Alert className="mb-4" description={notice} type="error" closable />}
            {/* <Row align="middle">
                <Col span={6}>
                    <label>请求Token：</label>
                </Col>
                <Col>
                    {editToken ? (
                        <Input
                            defaultValue={token}
                            style={{ minWidth: 300 }}
                            onBlur={(e) => onSaveToken((e.target as HTMLInputElement).value)}
                            onPressEnter={(e) => onSaveToken((e.target as HTMLInputElement).value)}
                        />
                    ) : (
                        <span>{token || "无"}</span>
                    )}
                </Col>
                <Col>
                    {!editToken && (
                        <Button type="link" onClick={() => setEditToken(true)}>
                            修改
                        </Button>
                    )}
                </Col>
            </Row> */}
            <Row align="middle" gutter={[16, 16]}>
                <Col span={6}>
                    <label>邮箱账号：</label>
                </Col>
                <Col span={18}>
                    <span>{userInfo.email}</span>
                </Col>
                <Col span={6}>
                    <label>邀请码：</label>
                </Col>
                <Col span={18}>
                    <span>{userInfo.inviteCode}</span>
                    <Button type="link" onClick={onCopyInviteUrl}>
                        复制邀请链接
                    </Button>
                </Col>
                <Col span={6}>
                    <label>剩余对话次数：</label>
                </Col>
                <Col span={18}>
                    <span>{userInfo.integral}</span>
                    <Tooltip title={notice}>
                        <Button type="link">如何获取更多次数?</Button>
                    </Tooltip>
                </Col>
                <Col span={24} className="flex justify-center">
                    <Button onClick={onLogout}>退出登录</Button>
                </Col>
            </Row>
        </Modal>
    );
};

export default Setting;
