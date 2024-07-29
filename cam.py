import cv2

def open_camera():
    # 打开摄像头，参数0表示第一个摄像头
    cap = cv2.VideoCapture(-1)

    if not cap.isOpened():
        print("无法打开摄像头")
        return

    # 设置摄像头捕获画面的分辨率
    width = 1920
    height = 1080
    ratio1 = 0.5
    ratio2 = 0.5
    
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, width*ratio1)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height*ratio2)

    while True:
        # 读取摄像头画面
        ret, frame = cap.read()

        if not ret:
            print("无法获取画面")
            break

        # 调整显示窗口的大小
        cv2.namedWindow('Camera', cv2.WINDOW_NORMAL)
        cv2.resizeWindow('Camera', width*ratio1, height*ratio2)

        # 显示画面
        cv2.imshow('Camera', frame)

        # 按下'q'键退出循环
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # 释放摄像头并关闭所有窗口
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    open_camera()