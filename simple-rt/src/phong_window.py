import math
import moderngl
import pyrr

from base_window import BaseWindowConfig


class PhongWindow(BaseWindowConfig):

    def __init__(self, **kwargs):
        super(PhongWindow, self).__init__(**kwargs)
        self.obj_sphere = self.load_scene('sphere.obj')
        self.vao_sphere = self.obj_sphere.root_nodes[0].mesh.vao.instance(self.program)

    def init_shaders_variables(self):
        self.object_color_location = self.program['objectColor']
        self.camera_position_location = self.program['cameraPosition']
        self.projection_matrix_location = self.program['projectionMatrix']
        self.lookat_matrix_location = self.program['lookatMatrix']
        self.model_matrix_location = self.program['modelMatrix']

    def render(self, time: float, frame_time: float):
        self.ctx.clear(0.8, 0.8, 0.8, 0.0)
        self.ctx.enable(moderngl.DEPTH_TEST | moderngl.CULL_FACE)

        proj = pyrr.Matrix44.perspective_projection(45.0, self.aspect_ratio, 0.1, 1000.0)
        lookat = pyrr.Matrix44.look_at(
            (3.0, 1.0, -5.0),
            (0.0, 0.0, 1.0),
            (0.0, 0.0, 1.0),
        )

        translation = pyrr.Matrix44.from_translation((0, 0, 0))
        rotation = pyrr.Matrix44.from_y_rotation(math.radians(0))
        scale = pyrr.Matrix44.from_scale((1, 1, 1))
        model_matrix = translation * rotation * scale

        self.object_color_location.write(pyrr.Vector3((1, 0, 1), dtype='f4'))
        self.camera_position_location.write(pyrr.Vector3((3, 1, -5), dtype='f4'))
        self.projection_matrix_location.write(proj.astype('f4'))
        self.lookat_matrix_location.write(lookat.astype('f4'))
        self.model_matrix_location.write(model_matrix.astype('f4'))
       
        self.vao_sphere.render()
