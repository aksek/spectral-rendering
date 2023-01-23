import numpy as np
import math
import moderngl
import pyrr
import time as t

from enum import Enum

from base_window import BaseWindowConfig


class ColorEditMode(Enum):
    LeftTetrahedronColor = 1,
    RightTetrahedronColor = 2,
    WallsColor = 3,
    LightColor = 4


class SimpleRTWindow(BaseWindowConfig):

    def __init__(self, **kwargs):
        super(SimpleRTWindow, self).__init__(**kwargs)
        self.obj_sphere = self.load_scene('square.obj')
        self.vao_sphere = self.obj_sphere.root_nodes[0].mesh.vao.instance(self.program)

        # camera edit variables
        self.camera_position = (0.0, 1.0, -4.0)
        self.camera_angle = 0
        self.camera_velocity = 1.0
        self.camera_angle_velocity = 0.1

        # color edit variables
        self.color_edit_mode = ColorEditMode.LightColor
        self.color_edit_direction = -1
        self.color_edit_velocity = 1
        self.left_tetrahedron_color = [0.1, 0.1, 0.2, 0, 0, 0, 0.6, 0.8, 0.9, 0.8]
        self.right_tetrahedron_color = [0.1, 0.1, 0.2, 0, 0.8, 0.9, 0.6, 0.1, 0.1, 0]
        self.walls_color = [0.8, 0.9, 0.8, 6, 0, 0, 0, 0, 0, 0.3]

    def init_shaders_variables(self):
        self.res_location = self.program['res']
        self.camera_position_location = self.program['cameraPosition']
        self.camera_angle_location = self.program['cameraAngle']
        self.left_tetrahedron_color_location = self.program['leftTetrahedronColor']
        self.right_tetrahedron_color_location = self.program['rightTetrahedronColor']
        self.walls_color_location = self.program['wallsColor']
        self.light_color_location = self.program['lightColor']


    def key_event(self, key, action, modifiers):
        if action == self.wnd.keys.ACTION_PRESS:

            # move camera right/left/up/down
            if key == self.wnd.keys.D:
                self.update_camera_position(0, 1)
            elif key == self.wnd.keys.A:
                self.update_camera_position(0, -1)
            elif key == self.wnd.keys.W:
                self.update_camera_position(1, 1)
            elif key == self.wnd.keys.S:
                self.update_camera_position(1, -1)

            # move camera closer/further
            elif key == self.wnd.keys.R:
                self.update_camera_position(2, 1)
            elif key == self.wnd.keys.F:
                self.update_camera_position(2, -1)

            # rotate camera around X axis [WIP]
            elif key == self.wnd.keys.Q:
                self.update_camera_angle(-1)
            elif key == self.wnd.keys.E:
                self.update_camera_angle(1)

            # choose color to edit
            elif key == self.wnd.keys.O:
                self.color_edit_mode = ColorEditMode.LeftTetrahedronColor
            elif key == self.wnd.keys.P:
                self.color_edit_mode = ColorEditMode.RightTetrahedronColor
            elif key == self.wnd.keys.K:
                self.color_edit_mode = ColorEditMode.WallsColor
            elif key == self.wnd.keys.L:
                self.color_edit_mode = ColorEditMode.LightColor
            
            # choose if add or subtract color
            elif key == self.wnd.keys.EQUAL:
                self.color_edit_direction = 1
            elif key == self.wnd.keys.MINUS:
                self.color_edit_direction = -1

            # add or subtract color to bucket
            elif key == self.wnd.keys.NUMBER_0:
                self.update_color(0)
            elif key == self.wnd.keys.NUMBER_1:
                self.update_color(1)
            elif key == self.wnd.keys.NUMBER_2:
                self.update_color(2)
            elif key == self.wnd.keys.NUMBER_3:
                self.update_color(3)
            elif key == self.wnd.keys.NUMBER_4:
                self.update_color(4)
            elif key == self.wnd.keys.NUMBER_5:
                self.update_color(5)
            elif key == self.wnd.keys.NUMBER_6:
                self.update_color(6)
            elif key == self.wnd.keys.NUMBER_7:
                self.update_color(7)
            elif key == self.wnd.keys.NUMBER_8:
                self.update_color(8)
            elif key == self.wnd.keys.NUMBER_9:
                self.update_color(9)

            self.render(0, 0)


    def update_camera_position(self, axis, direction):
        current_value = self.camera_position[axis]
        current_value += direction * self.camera_velocity
        if axis == 0:
            self.camera_position = (current_value, self.camera_position[1], self.camera_position[2])
        if axis == 1:
            self.camera_position = (self.camera_position[0], current_value, self.camera_position[2])
        if axis == 2:
            self.camera_position = (self.camera_position[0], self.camera_position[1], current_value)


    def update_camera_angle(self, value):
        self.camera_angle += self.camera_angle_velocity * value


    def update_color(self, index):
        if self.color_edit_mode == ColorEditMode.LeftTetrahedronColor:
            self.left_tetrahedron_color[index] += self.color_edit_direction * self.color_edit_velocity
            self.left_tetrahedron_color[index] = np.clip(self.left_tetrahedron_color[index], 0, 1)

        elif self.color_edit_mode == ColorEditMode.RightTetrahedronColor:
            self.right_tetrahedron_color[index] += self.color_edit_direction * self.color_edit_velocity
            self.right_tetrahedron_color[index] = np.clip(self.right_tetrahedron_color[index], 0, 1)

        elif self.color_edit_mode == ColorEditMode.LightColor:
            self.light_color[index] += self.color_edit_direction * self.color_edit_velocity
            self.light_color[index] = np.clip(self.light_color[index], 0, 1)

        elif self.color_edit_mode == ColorEditMode.WallsColor:
            self.walls_color[index] += self.color_edit_direction * self.color_edit_velocity
            self.walls_color[index] = np.clip(self.walls_color[index], 0, 1)



    def unicode_char_entered(self, char: str):
        print('character entered:', char)


    def render(self, time: float, frame_time: float):
        self.ctx.clear(0.8, 0.8, 0.8, 0.0)
        self.ctx.enable(moderngl.DEPTH_TEST | moderngl.CULL_FACE)

        self.res_location.write(pyrr.Vector3((self.window_size[0], self.window_size[1], 0), dtype='f4'))
        self.camera_position_location.write(pyrr.Vector3(self.camera_position, dtype='f4'))

        self.camera_angle_location.value = self.camera_angle
        self.left_tetrahedron_color_location.value = self.left_tetrahedron_color
        self.right_tetrahedron_color_location.value = self.right_tetrahedron_color
        self.walls_color_location.value = self.walls_color
        self.light_color_location.value = self.light_color

        self.vao_sphere.render()
