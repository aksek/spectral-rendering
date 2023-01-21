import math
import moderngl
import pyrr

from base_window import BaseWindowConfig


class SimpleRTWindow(BaseWindowConfig):

    def __init__(self, **kwargs):
        super(SimpleRTWindow, self).__init__(**kwargs)
        self.obj_sphere = self.load_scene('sphere.obj')
        self.vao_sphere = self.obj_sphere.root_nodes[0].mesh.vao.instance(self.program)

    def init_shaders_variables(self):
        pass

    def render(self, time: float, frame_time: float):
        self.ctx.clear(0.8, 0.8, 0.8, 0.0)
        self.ctx.enable(moderngl.DEPTH_TEST | moderngl.CULL_FACE)
        self.vao_sphere.render()
