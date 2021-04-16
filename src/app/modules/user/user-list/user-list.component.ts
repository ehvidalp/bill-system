import { Component, OnInit } from '@angular/core';
import { User } from '@models/user';
import { SnackbarService } from '@services/snackbar.service';
import { UsersService } from '@services/users.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] | undefined
  loadingData = true;
  skeletonDiv = new Array(7)
  constructor(
    private userService: UsersService,
    private snackService: SnackbarService
  ) { }

  ngOnInit() {
    this.getUsers()
  }

  getUsers() {
    this.userService.getAll().subscribe(data => {
      this.users = data
      this.loadingData = false
    }, (err => {
      console.log(err)
    }))
  }

  deleteUser(userId: string | undefined) {
    Swal.fire({
      title: '¿Desea eliminar el usuario?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar',
      confirmButtonColor: 'green',
      cancelButtonColor: 'red',
      icon: 'question',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.delete(userId!).then(()=> {
          this.snackService.setSuccess({success: true, message: 'Usuario eliminado'})
          this.getUsers()
        })
      }
    });
  }
}
