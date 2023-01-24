import math
import moderngl
import pyrr

from moderngl_window import WindowConfig
from moderngl_window import geometry
from pathlib import Path


import config
from shaders.shader_utils import get_shaders


class BaseWindowConfig(WindowConfig):
    gl_version = config.GL_VERSION
    title = config.WINDOW_TITLE
    resource_dir = (Path(__file__).parent.parent / 'resources' / 'models').resolve()

    def __init__(self, **kwargs):
        super(BaseWindowConfig, self).__init__(**kwargs)
        self.reflections_num = self.argv.reflections_num
        cur_dir = str(Path(__file__).parent.resolve())
        if self.argv.use_binning:
            shaders_dir_path = cur_dir + '/../resources/shaders/simple-rt'
            shader_name = 'simple-rt'
        else:
            shaders_dir_path = cur_dir + '/../resources/shaders/simple-rt-rgb'
            shader_name = 'simple-rt-rgb'
        
        shaders = get_shaders(shaders_dir_path)

        self.light_color = [float(x) for x in self.argv.light_color.split(',')]
        print(self.light_color)
        self.program = self.ctx.program(vertex_shader=shaders[shader_name].vertex_shader,
                                        geometry_shader=shaders[shader_name].geometry_shader,
                                        fragment_shader=shaders[shader_name].fragment_shader)
        self.init_shaders_variables()
        

    def init_shaders_variables(self):
        pass

    @classmethod
    def add_arguments(cls, parser):

        parser.add_argument('--use_binning', type=bool, required=True, help='Switches spectral rendering on/off')
        parser.add_argument('--light_color', type=str, required=False, help='Specify light color', default='1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0')
        parser.add_argument('--reflections_num', type=int, required=True, help='num of ray reflections')

    def render(self, time: float, frame_time: float):
        pass
