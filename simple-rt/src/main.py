import moderngl_window

from simple_rt_window import SimpleRTWindow

if __name__ == '__main__':
    moderngl_window.run_window_config(SimpleRTWindow)

# python main.py --shaders_dir_path=../resources/shaders/simple-rt --shader_name=simple-rt