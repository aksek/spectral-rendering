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

        shaders = get_shaders(self.argv.shaders_dir_path)
        self.program = self.ctx.program(vertex_shader=shaders[self.argv.shader_name].vertex_shader,
                                        geometry_shader=shaders[self.argv.shader_name].geometry_shader,
                                        fragment_shader=shaders[self.argv.shader_name].fragment_shader)
        self.init_shaders_variables()

    def init_shaders_variables(self):
        pass

    @classmethod
    def add_arguments(cls, parser):
        parser.add_argument('--shaders_dir_path', type=str, required=True, help='Path to the directory with shaders')
        parser.add_argument('--shader_name', type=str, required=True,
                            help='Name of the shader to look for in the shader_path directory')
        parser.add_argument('--model_name', type=str, required=False, help='Name of the model to load')

    def render(self, time: float, frame_time: float):
        pass
